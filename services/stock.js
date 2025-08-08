const Account = require("../models/account");
const Stock = require("../models/stock");

const mongoose = require("mongoose");
const { uploadBase64ToS3 } = require("../utils/uploadToS3");

exports.getAllStockService = async (userOrgId, role, userId, req) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const skip = (page - 1) * limit;
  const search = req.query.search || "";

  const matchStage = {
    isDeleted: false,
    isSelled: false,
  };

  if (role === "user") {
    matchStage.organization = new mongoose.Types.ObjectId(userOrgId);
  }

  const pipeline = [
    { $match: matchStage },

    // Lookup for Model (for searching)
    {
      $lookup: {
        from: "models",
        localField: "modelName",
        foreignField: "_id",
        as: "modelName",
      },
    },
    { $unwind: "$modelName" },

    // Search by IMEI or model.modelName
    {
      $match: {
        $or: [
          { imeiNo: { $regex: search, $options: "i" } },
          { "modelName.modelName": { $regex: search, $options: "i" } },
        ],
      },
    },

    // Lookup all other refs (simulate full populate)
    {
      $lookup: {
        from: "organizations",
        localField: "organization",
        foreignField: "_id",
        as: "organization",
      },
    },
    { $unwind: "$organization" },

    {
      $lookup: {
        from: "organizationbranches",
        localField: "branch",
        foreignField: "_id",
        as: "branch",
      },
    },
    { $unwind: "$branch" },

    {
      $lookup: {
        from: "customers",
        localField: "customerName",
        foreignField: "_id",
        as: "customerName",
      },
    },
    { $unwind: { path: "$customerName", preserveNullAndEmptyArrays: true } },

    {
      $lookup: {
        from: "categories",
        localField: "categoryName",
        foreignField: "_id",
        as: "categoryName",
      },
    },
    { $unwind: "$categoryName" },

    {
      $lookup: {
        from: "devices",
        localField: "deviceName",
        foreignField: "_id",
        as: "deviceName",
      },
    },
    { $unwind: "$deviceName" },

    {
      $lookup: {
        from: "capacities",
        localField: "capacityName",
        foreignField: "_id",
        as: "capacityName",
      },
    },
    { $unwind: "$capacityName" },

    {
      $lookup: {
        from: "colors",
        localField: "color",
        foreignField: "_id",
        as: "color",
      },
    },
    { $unwind: "$color" },

    {
      $lookup: {
        from: "payments",
        localField: "payment",
        foreignField: "_id",
        as: "payment",
      },
    },
    { $unwind: { path: "$payment", preserveNullAndEmptyArrays: true } },

    // Sorting and Pagination
    { $sort: { createdAt: -1 } },
    { $skip: skip },
    { $limit: limit },
  ];

  const data = await mongoose.model("Stock").aggregate(pipeline);

  // Get total count with same search/match conditions (but no pagination)
  const countPipeline = [
    { $match: matchStage },
    {
      $lookup: {
        from: "models",
        localField: "modelName",
        foreignField: "_id",
        as: "modelName",
      },
    },
    { $unwind: "$modelName" },
    {
      $match: {
        $or: [
          { imeiNo: { $regex: search, $options: "i" } },
          { "modelName.modelName": { $regex: search, $options: "i" } },
        ],
      },
    },
    { $count: "total" },
  ];

  const countResult = await mongoose.model("Stock").aggregate(countPipeline);
  const totalCount = countResult[0]?.total || 0;

  return { totalCount, items: data };
};

exports.getStockService = async (stockId) => {
  const stockData = await Stock.findById(stockId)
    .populate(
      "organization branch customerName categoryName modelName deviceName capacityName color"
    )
    .lean();
  return stockData;
};

// exports.createStockService = async (newStock) => {
//   const { payment } = newStock;

//   payment.forEach(
//     async (item) =>
//       await Account.findByIdAndUpdate(
//         item.paymentAccount,
//         {
//           $inc: { balance: -item.paymentAmount },
//         },
//         { new: true }
//       )
//   );

//   const stockData = await Stock.create(newStock);

//   return stockData;
// };

exports.createStockService = async (newStock) => {
  const { payment, upload } = newStock;

  // Upload base64 image to S3 if available
  if (upload) {
    const imageUrl = await uploadBase64ToS3(upload);
    newStock.upload = imageUrl; // Replace base64 with URL
  }

  // Deduct payment from accounts
  await Promise.all(
    payment.map((item) =>
      Account.findByIdAndUpdate(
        item.paymentAccount,
        { $inc: { balance: -item.paymentAmount } },
        { new: true }
      )
    )
  );

  const stockData = await Stock.create(newStock);
  return stockData;
};

exports.updateStockService = async (stockId, stock) => {
  const { payment } = stock;

  const deviceData = stock && stock.device && stock.device[0];

  const imeiData = deviceData && deviceData.imei[0];

  const data = await Stock.findByIdAndUpdate(
    stockId,
    {
      organization: stock?.organization || null,
      branch: stock?.branch || null,
      customerName: stock?.customerName || null,
      customerPhone: stock?.customerPhone || null,

      categoryName: deviceData?.categoryName || null,
      modelName: deviceData?.modelName || null,
      capacityName: deviceData?.capacityName || null,
      color: deviceData?.color || null,
      deviceName: deviceData?.deviceName || null,

      imeiNo: imeiData?.imeiNo || null,
      srNo: imeiData?.srNo || null,
      totalAmount: imeiData?.totalAmount || null,
      paidToCustomer: imeiData?.paidToCustomer || null,
      remainingAmount: imeiData?.remainingAmount || null,

      payment: stock?.payment || null,
    },
    { new: true }
  );

  await Promise.all(
    payment.map((item) =>
      Account.findByIdAndUpdate(
        item.paymentAccount,
        { $inc: { balance: -item.paymentAmount } },
        { new: true }
      )
    )
  );

  return data;
};

exports.softDeleteStockService = async (stockId) => {
  return await Stock.findByIdAndUpdate(stockId, { isDeleted: true });
};

exports.deleteStockService = async (stockId) => {
  return await Stock.findByIdAndDelete(stockId);
};

exports.getStockByOrgAndCusService = async (orgId, cusId) => {
  const stockData = await Stock.find({
    organization: orgId,
    customerName: cusId,
    isDeleted: false,
  })
    .populate("customerName deviceName")
    .lean();

  return stockData;
};

exports.getAllStockDetailsService = async () => {
  const data = await Stock.find({ isDeleted: false, isSelled: false })
    .sort({ createdAt: -1 })
    .populate(
      "organization branch categoryName modelName customerName capacityName deviceName color"
    )
    .populate("payment.paymentAccount");

  return data;
};


// const Stock = require("../models/stock");
// const Account = require("../models/account");

// exports.createStockFromExcelService = async (flatDeviceEntry) => {
//   const { payment } = flatDeviceEntry;

//   // Deduct payment from accounts
//   await Promise.all(
//     payment.map((item) =>
//       Account.findByIdAndUpdate(
//         item.paymentAccount,
//         { $inc: { balance: -item.paymentAmount } },
//         { new: true }
//       )
//     )
//   );

//   // No image upload needed for Excel
//   // flatDeviceEntry.upload = "";

//   // Create Stock
//   const stockData = await Stock.create(flatDeviceEntry);

//   return stockData;
// };




exports.createStockFromExcelService = async (flatDeviceEntry) => {
  const { payment } = flatDeviceEntry;

  // Validate paymentAccount existence
  await Promise.all(
    payment.map(async (item) => {
      const account = await Account.findById(item.paymentAccount);
      if (!account) {
        throw new Error(`Invalid paymentAccount ID: ${item.paymentAccount}`);
      }

      await Account.findByIdAndUpdate(
        item.paymentAccount,
        { $inc: { balance: -item.paymentAmount } },
        { new: true }
      );
    })
  );

  // Create Stock
  const stockData = await Stock.create(flatDeviceEntry);
  return stockData;
};
