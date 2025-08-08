const { default: mongoose } = require("mongoose");
const account = require("../models/account");
const Repair = require("../models/repair");
const Sell = require("../models/sell");
const Stock = require("../models/stock");

exports.getAllSellService = async (userBranchId, role, userId, req) => {
  const page = parseInt(req.query.page) || 1; // Default to page 1
  const limit = parseInt(req.query.limit) || 10; // Default to 10 items per page

  const query = req.query.search || "";

  const skip = (page - 1) * limit;

  const filter = {
    ...query,
    isDeleted: false,
    ...(role === "user" && { branch: userBranchId }),
    // you can add more conditions here if needed for other roles
  };

  const data = await Sell.find(filter)
    .populate("organization branch customerName modelName deviceName stock")
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit)
    .lean();

  const totalCount = await Sell.countDocuments(filter);

  return { totalCount, items: data };
};

exports.getSellService = async (sellId) => {
  const sellData = await Sell.findById(sellId)
    .populate("organization branch customerName modelName deviceName stock")
    .lean();
  return sellData;
};

exports.createSellService = async (newSell, stock, amount) => {
  const { payment } = newSell;

  payment.forEach(
    async (item) =>
      await account.findByIdAndUpdate(item.paymentAccount, {
        $inc: { balance: +item.paymentAmount },
      })
  );

  const createSell = await Sell.create(newSell);
  const updateStock = await Stock.findByIdAndUpdate(
    stock,
    { isSelled: true, sellAmount: amount },
    {
      new: true,
    }
  );

  return { createSell, updateStock };
};

exports.updateSellService = async (sellId, sell) => {
  const { payment } = sell;
  const deviceData = sell && sell.device && sell.device[0];

  const data = await Sell.findByIdAndUpdate(
    sellId,
    {
      amount: deviceData.amount,
      customerPaid: deviceData.customerPaid,
      remainingAmount: deviceData.remainingAmount,
      paymentType: deviceData.paymentType,
    },
    { new: true }
  );

  payment.forEach(
    async (item) =>
      await account.findByIdAndUpdate(item.paymentAccount, {
        $inc: { balance: +item.paymentAmount },
      })
  );

  return data;
};

exports.softDeleteSellService = async (sellId) => {
  return await Sell.findByIdAndUpdate(sellId, { isDeleted: true });
};

exports.deleteSellService = async (sellId) => {
  return await Sell.findByIdAndDelete(sellId);
};

exports.getSellByDateService = async ({ startDate, endDate }, branchId) => {
  const filter = { isDeleted: false };

  try {
    const start = new Date(startDate);
    const end = new Date(endDate);
    end.setHours(23, 59, 59, 999);

    if (isNaN(start) || isNaN(end)) {
      throw new Error("Invalid date format");
    }

    filter.createdAt = {
      $gte: start,
      $lte: end,
    };

    if (branchId) {
      filter.branch = new mongoose.Types.ObjectId(branchId);
    }

    const result = await Sell.find(filter)
      .populate("organization branch modelName deviceName customerName stock")
      .lean();

    return result;
  } catch (err) {
    console.error("❌ Error in getExpenseByDateService:", err.message);
    throw err;
  }
};
exports.getAllStockSellRepairService = async (
  userOrgId,
  role,
  userId,
  req,
  userBranchId
) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const skip = (page - 1) * limit;
  const type = req.query.type || "all"; // 'all', 'sell', 'stock', or 'repair'

  const orgId = req.query.orgId;
  const cusId = req.query.cusId;

  const startDate = req.query.startDate ? new Date(req.query.startDate) : null;
  const endDate = req.query.endDate ? new Date(req.query.endDate) : null;

  // Base match condition
  const baseMatchCondition = {
    isDeleted: false,
  };

  if (startDate || endDate) {
    baseMatchCondition.createdAt = {};
    if (startDate) {
      baseMatchCondition.createdAt.$gte = startDate;
    }
    if (endDate) {
      // To include full end day, set time to 23:59:59.999
      endDate.setHours(23, 59, 59, 999);
      baseMatchCondition.createdAt.$lte = endDate;
    }
  }

  // Add filters if present
  if (orgId) {
    baseMatchCondition.organization = new mongoose.Types.ObjectId(orgId);
  }
  if (cusId) {
    baseMatchCondition.customerName = new mongoose.Types.ObjectId(cusId);
  }

  if (userBranchId) {
    baseMatchCondition.branch = new mongoose.Types.ObjectId(userBranchId);
  }

  const result = {
    totalCount: 0,
    items: {},
    sellTotals: null,
    sellCount: 0,
    stockTotals: null,
    stockCount: 0,
    repairTotals: null,
    repairCount: 0,
  };

  // SELL
  if (type === "all" || type === "sell") {
    const [sellAggregates] = await Sell.aggregate([
      { $match: baseMatchCondition },
      {
        $group: {
          _id: null,
          totalAmount: { $sum: "$amount" },
          paidAmount: { $sum: "$customerPaid" },
          remainingAmount: { $sum: "$remainingAmount" },
        },
      },
    ]);

    const sellData = await Sell.find(baseMatchCondition)
      .populate({
        path: "organization",
        match: role === "user" ? { _id: userOrgId } : { userId },
      })
      .populate("branch customerName modelName deviceName")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean();

    const sellCount = await Sell.countDocuments(baseMatchCondition);

    result.items.sellData = sellData;
    result.sellTotals = sellAggregates || {
      totalAmount: 0,
      paidAmount: 0,
      remainingAmount: 0,
    };
    result.sellCount = sellCount;
    result.totalCount += sellCount;
  }

  // STOCK
  if (type === "all" || type === "stock") {
    const stockMatchCondition = {
      ...baseMatchCondition,
      isSelled: false,
    };

    const [stockAggregates] = await Stock.aggregate([
      { $match: stockMatchCondition },
      {
        $group: {
          _id: null,
          totalAmount: { $sum: "$totalAmount" },
          paidAmount: { $sum: "$paidToCustomer" },
          remainingAmount: { $sum: "$remainingAmount" },
        },
      },
    ]);

    const stockData = await Stock.find(stockMatchCondition)
      .populate({
        path: "organization",
        match: role === "user" ? { _id: userOrgId } : { userId },
      })
      .populate(
        "branch customerName categoryName modelName deviceName capacityName color"
      )
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean();

    const stockCount = await Stock.countDocuments(stockMatchCondition);

    result.items.stockData = stockData;
    result.stockTotals = stockAggregates || {
      totalAmount: 0,
      paidAmount: 0,
      remainingAmount: 0,
    };
    result.stockCount = stockCount;
    result.totalCount += stockCount;
  }

  // REPAIR
  if (type === "all" || type === "repair") {
    const [repairAggregates] = await Repair.aggregate([
      { $match: baseMatchCondition },
      {
        $group: {
          _id: null,
          totalAmount: { $sum: "$amount" },
          estimatedCost: { $sum: "$estimatedCost" },
        },
      },
    ]);

    const repairData = await Repair.find(baseMatchCondition)
      .populate({
        path: "organization",
        match: role === "user" ? { _id: userOrgId } : { userId },
      })
      .populate("branch customerName modelName deviceName")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean();

    const repairCount = await Repair.countDocuments(baseMatchCondition);

    result.items.repairData = repairData;
    result.repairTotals = repairAggregates || {
      totalAmount: 0,
      estimatedCost: 0,
    };
    result.repairCount = repairCount;
    result.totalCount += repairCount;
  }

  return result;
};
