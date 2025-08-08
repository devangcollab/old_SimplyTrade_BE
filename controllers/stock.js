const {
  getAllStockService,
  getStockService,
  createStockService,
  updateStockService,
  deleteStockService,
  softDeleteStockService,
  getStockByOrgAndCusService,
  getAllStockDetailsService,
  createStockFromExcelService,
} = require("../services/stock");
const { createLogActivity } = require("../utils/logActivity");

exports.getAllStock = async (req, res) => {
  try {
    const userOrgId = req.user.org;
    const role = req.user.role;
    const userId = req.user.id;
    const stock = await getAllStockService(userOrgId, role, userId, req);
    if (!stock) {
      return res.status(404).json({ message: "No Stock found" });
    }

    return res.status(200).json({
      message: "Stock retrieved successfully",
      data: stock,
    });
  } catch (err) {
    console.log(err);

    return res
      .status(500)
      .json({ message: "Internal server error", error: err.message });
  }
};

exports.getStock = async (req, res) => {
  try {
    const stockId = req.params.id;
    const stock = await getStockService(stockId);
    if (!stock) {
      return res.status(404).json({ message: "No Stock found" });
    }

    return res.status(200).json({
      message: "Stock retrieved successfully",
      data: stock,
    });
  } catch (err) {
    return res
      .status(500)
      .json({ message: "Internal server error", error: err.message });
  }
};

exports.createStock = async (req, res) => {
  try {
    const newStock = req.body;
    const { device, payment } = newStock;

    // Validate request body
    if (!device || !Array.isArray(device) || device.length === 0) {
      return res.status(400).json({ message: "Invalid device data" });
    }

    if (!payment || !Array.isArray(payment) || payment.length === 0) {
      return res.status(400).json({ message: "Invalid Payment data" });
    }

    const stockEntries = [];

    // Loop through device and imei
    device.forEach((deviceItem) => {
      if (deviceItem.imei && Array.isArray(deviceItem.imei)) {
        deviceItem.imei.forEach((imeiItem) => {
          // Create a stock entry for each imei
          const stockEntry = {
            organization: newStock.organization,
            branch: newStock.branch,
            customerName: newStock.customerName,
            customerPhone: newStock.customerPhone,
            categoryName: deviceItem.categoryName,
            modelName: deviceItem.modelName,
            deviceName: deviceItem.deviceName,
            capacityName: deviceItem.capacityName,
            color: deviceItem.color,
            imeiNo: imeiItem.imeiNo,
            srNo: imeiItem.srNo,
            totalAmount: imeiItem.totalAmount,
            paidToCustomer: imeiItem.paidToCustomer,
            remainingAmount: imeiItem.remainingAmount,
            upload: newStock.upload,
            payment: payment,
          };
          stockEntries.push(stockEntry);
        });
      }
    });

    // Save all stock entries to the database
    const createdStocks = await Promise.all(
      stockEntries.map((entry) => createStockService(entry))
    );
    await createLogActivity(req, `create ${stockEntries.length} stock`);

    return res
      .status(200)
      .json({ message: "Stocks created", data: createdStocks });
  } catch (err) {
    return res
      .status(500)
      .json({ message: "Internal server error", error: err.message });
  }
};

exports.updateStock = async (req, res) => {
  try {
    const stockId = req.params.id;
    const updateData = req.body;

    // Optional: Validate certain fields if required
    if (updateData.device && !Array.isArray(updateData.device)) {
      return res.status(400).json({ message: "Device must be an array" });
    }

    // Call service with only provided fields (partial update)
    const updatedStock = await updateStockService(stockId, updateData);

    if (!updatedStock) {
      return res.status(404).json({ message: "Stock not found" });
    }
    await createLogActivity(req, `update stock`);

    return res
      .status(200)
      .json({ message: "Stock updated", data: updatedStock });
  } catch (err) {
    return res
      .status(500)
      .json({ message: "Internal server error", error: err.message });
  }
};

exports.softDeleteStock = async (req, res) => {
  try {
    const stockId = req.params.id;
    const stock = await softDeleteStockService(stockId);
    if (!stock) {
      return res.status(404).json({ message: "Stock not found" });
    }
    await createLogActivity(req, `update stock`);

    return res.status(200).json({ message: "Stock soft deleted", data: stock });
  } catch (err) {
    return res
      .status(500)
      .json({ message: "Internal server error", error: err.message });
  }
};

exports.deleteStock = async (req, res) => {
  try {
    const stockId = req.params.id;
    const stock = await deleteStockService(stockId);
    if (!stock) {
      return res.status(404).json({ message: "Stock not found" });
    }
    await createLogActivity(req, `delete stock`);

    return res.status(200).json({ message: "Stock deleted", data: stock });
  } catch (err) {
    return res
      .status(500)
      .json({ message: "Internal server error", error: err.message });
  }
};

exports.findStockByOrgAndCustomer = async (req, res) => {
  try {
    const orgId = req?.query?.orgId;
    const cusId = req?.query?.cusId;

    const stock = await getStockByOrgAndCusService(orgId, cusId);
    if (!stock) {
      return res.status(404).json({ message: "No Stock found" });
    }

    return res.status(200).json({
      message: "Stock retrieved successfully",
      data: stock,
    });
  } catch (err) {
    return res
      .status(500)
      .json({ message: "Internal server error", error: err.message });
  }
};

exports.getAllStockDetails = async (req, res) => {
  try {
    const stock = await getAllStockDetailsService();
    if (!stock) {
      return res.status(404).json({ message: "No Stock found" });
    }

    return res.status(200).json({
      message: "Stock retrieved successfully",
      data: stock,
    });
  } catch (err) {
    console.log(err);

    return res
      .status(500)
      .json({ message: "Internal server error", error: err.message });
  }
};

// const XLSX = require("xlsx");
// const fs = require("fs");
// const Stock = require("../models/stock");
// const { createStockService } = require("../services/stock.service");

// exports.importStockFromExcel = async (req, res) => {
//   try {
//     if (!req.file) return res.status(400).json({ message: "No file uploaded" });

//     const workbook = XLSX.readFile(req.file.path);
//     const sheetName = workbook.SheetNames[0];
//     const rows = XLSX.utils.sheet_to_json(workbook.Sheets[sheetName]);

//     fs.unlinkSync(req.file.path); // delete file after reading

//     if (!rows || rows.length === 0) {
//       return res.status(400).json({ message: "Excel file is empty" });
//     }

//     const paymentSet = new Set();
//     const stockEntries = [];

//     const groupedStock = {
//       organization: rows[0].organization,
//       branch: rows[0].branch,
//       customerName: rows[0].customerName,
//       customerPhone: rows[0].customerPhone,
//       upload: "",
//       device: [],
//       payment: [],
//     };

//     const deviceMap = new Map();

//     rows.forEach((row) => {
//       const deviceKey = `${row.categoryName}_${row.modelName}_${row.deviceName}_${row.capacityName}_${row.color}`;
//       if (!deviceMap.has(deviceKey)) {
//         deviceMap.set(deviceKey, {
//           categoryName: row.categoryName,
//           modelName: row.modelName,
//           deviceName: row.deviceName,
//           capacityName: row.capacityName,
//           color: row.color,
//           imei: [],
//         });
//       }

//       deviceMap.get(deviceKey).imei.push({
//         imeiNo: row.imeiNo,
//         srNo: row.srNo,
//         totalAmount: row.totalAmount,
//         paidToCustomer: row.paidToCustomer,
//         remainingAmount: row.remainingAmount,
//       });

//       // Payment collection (unique)
//       const paymentKey = `${row.paymentAccount}_${row.paymentAmount}`;
//       if (!paymentSet.has(paymentKey)) {
//         paymentSet.add(paymentKey);
//         groupedStock.payment.push({
//           paymentAccount: row.paymentAccount,
//           paymentAmount: Number(row.paymentAmount),
//         });
//       }
//     });

//     groupedStock.device = Array.from(deviceMap.values());

//     // Reuse createStock logic
//     const finalStockEntries = [];

//     groupedStock.device.forEach((deviceItem) => {
//       deviceItem.imei.forEach((imeiItem) => {
//         finalStockEntries.push({
//           organization: groupedStock.organization,
//           branch: groupedStock.branch,
//           customerName: groupedStock.customerName,
//           customerPhone: groupedStock.customerPhone,
//           categoryName: deviceItem.categoryName,
//           modelName: deviceItem.modelName,
//           deviceName: deviceItem.deviceName,
//           capacityName: deviceItem.capacityName,
//           color: deviceItem.color,
//           imeiNo: imeiItem.imeiNo,
//           srNo: imeiItem.srNo,
//           totalAmount: imeiItem.totalAmount,
//           paidToCustomer: imeiItem.paidToCustomer,
//           remainingAmount: imeiItem.remainingAmount,
//           // upload: groupedStock.upload,
//           payment: groupedStock.payment,
//         });
//       });
//     });
//     console.log(createdStocks , "createdStok")

//     const createdStocks = await Promise.all(
//       finalStockEntries.map((entry) => createStockFromExcelService(entry))
//     );

//     return res.status(200).json({
//       message: "Excel data imported successfully",
//       insertedCount: createdStocks.length,
//     });
//   } catch (err) {
//     console.error("Excel import error:", err);
//     res.status(500).json({ message: "Internal server error", error: err.message });
//   }
// };
const XLSX = require("xlsx");
const fs = require("fs");

// Models
const Stock = require("../models/stock");
const Organization = require("../models/organization");
const Branch = require("../models/organizationBranch");
const Customer = require("../models/customer");
const Category = require("../models/category");
const Model = require("../models/model");
const Device = require("../models/device");
const Capacity = require("../models/capacity");
const Color = require("../models/color");
const Account = require("../models/account");


exports.importStockFromExcelWithNameMapping = async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ message: "No file uploaded" });

    // Parse Excel file
    const workbook = XLSX.readFile(req.file.path);
    const sheet = workbook.Sheets[workbook.SheetNames[0]];
    const rows = XLSX.utils.sheet_to_json(sheet);
    fs.unlinkSync(req.file.path);

    if (rows.length === 0) {
      return res.status(400).json({ message: "Excel file is empty" });
    }

    const createdStocks = [];

    for (const [index, row] of rows.entries()) {
      // 🔁 Map names to ObjectIds
      const [
        organization,
        branch,
        customer,
        category,
        model,
        device,
        capacity,
        color,
        paymentAccount,
      ] = await Promise.all([
        Organization.findOne({ organizationName: row.organizationName }),
        Branch.findOne({ branchName: row.branchName }),
        row.customerName ? Customer.findOne({ customerName: row.customerName }) : null,
        Category.findOne({ categoryName: row.categoryName }),
        Model.findOne({ modelName: row.modelName }),
        Device.findOne({ deviceName: row.deviceName }),
        Capacity.findOne({ capacityName: row.capacityName }),
        Color.findOne({ colorName: row.colorName }),
        Account.findOne({ accountName: row.accountName }),
      ]);

      const missingFields = [];
      if (!organization) missingFields.push("organization");
      if (!branch) missingFields.push("branch");
      if (!category) missingFields.push("categoryName");
      if (!model) missingFields.push("modelName");
      if (!device) missingFields.push("deviceName");
      if (!capacity) missingFields.push("capacityName");
      if (!color) missingFields.push("color");
      if (!paymentAccount) missingFields.push("paymentAccount");


      if (missingFields.length > 0) {
        return res.status(400).json({
          message: `Row ${
            index + 2
          } is missing or invalid: ${missingFields.join(", ")}`,
          rowData: row,
        });
      }

      const stockEntry = {
        organization: organization._id,
        branch: branch._id,
        customerName: customer ? customer._id : null,
        customerPhone: String(row.customerPhone),
        categoryName: category._id,
        modelName: model._id,
        deviceName: device._id,
        capacityName: capacity._id,
        color: color._id,
        imeiNo: String(row.imeiNo),
        srNo: row.srNo || "",
        totalAmount: Number(row.totalAmount),
        paidToCustomer: Number(row.paidToCustomer),
        remainingAmount: Number(row.remainingAmount) || 0,
        upload: "", // No upload from Excel
        payment: [
          {
            paymentAccount: paymentAccount._id,
            paymentAmount: Number(row.paymentAmount),
          },
        ],
      };

      const created = await createStockFromExcelService(stockEntry);
      createdStocks.push(created);
    }

    return res.status(200).json({
      message: "Stocks imported successfully",
      inserted: createdStocks.length,
      data: createdStocks,
    });
  } catch (error) {
    console.error("Excel import error:", error);
    return res
      .status(500)
      .json({ message: "Internal server error", error: error.message });
  }
};
