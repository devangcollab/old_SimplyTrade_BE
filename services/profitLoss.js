const Stock = require("../models/stock");
const Expense = require("../models/expense");
const { default: mongoose } = require("mongoose");
exports.getProfitLossService = async (userOrgId, role, userId, branchId) => {
  const filter = {
    isSelled: true,
  };
  if (branchId) {
    filter.branch = branchId;
  }

  const data = await Stock.find(filter)
    .populate({
      path: "organization",
      match: role === "user" ? { _id: userOrgId } : { userId: userId },
    })
    .sort({ createdAt: -1 })
    .populate("deviceName modelName categoryName branch")
    .lean();

  const filteredData = data.filter((item) => item.organization);

  let totalAmount = 0;
  let totalExpense = 0;
  let totalSelling = 0;
  let totalProfitOrLoss = 0;

  const individualDetails = filteredData.map((stock) => {
    const totalAmountStock = stock.totalAmount || 0;
    const totalExpenseStock = stock.expenseAmount || 0;
    const totalSellingStock = stock.sellAmount || 0;

    const totalCost = totalAmountStock + totalExpenseStock;
    const profitOrLoss = totalSellingStock - totalCost;
    const status =
      profitOrLoss > 0 ? "profit" : profitOrLoss < 0 ? "loss" : "break-even";

    // Accumulate overall totals
    totalAmount += totalAmountStock;
    totalExpense += totalExpenseStock;
    totalSelling += totalSellingStock;
    totalProfitOrLoss += profitOrLoss;

    return {
      ...stock,
      totalAmount: totalAmountStock,
      totalExpense: totalExpenseStock,
      totalSellingAmount: totalSellingStock,
      totalCost,
      profitOrLoss,
      status,
    };
  });

  const matchStage = {
    category: "General",
    isDeleted: false,
  };

  const isAdmin = role === "admin";

  if (!isAdmin) {
    matchStage.branchName = new mongoose.Types.ObjectId(branchId);
  }

  const generalTotal = await Expense.aggregate([
    { $match: matchStage },
    {
      $lookup: {
        from: "stocks", // collection name (usually lowercase plural of model)
        localField: "stock",
        foreignField: "_id",
        as: "stockData",
      },
    },
    {
      $unwind: {
        path: "$stockData",
        preserveNullAndEmptyArrays: true, // in case some expenses don't have linked stock
      },
    },
    {
      $addFields: {
        combinedAmount: {
          $add: [
            { $ifNull: ["$amount", 0] },
            { $ifNull: ["$stockData.totalAmount", 0] },
          ],
        },
      },
    },
    {
      $group: {
        _id: null,
        totalAmount: { $sum: "$combinedAmount" },
      },
    },
  ]);

  const totalGeneralExpense = generalTotal[0]?.totalAmount || 0;

  const totalAfterExpense = totalProfitOrLoss - totalGeneralExpense;

  const overallStatus =
    totalAfterExpense > 0
      ? "profit"
      : totalAfterExpense < 0
      ? "loss"
      : "break-even";

  return {
    individualDetails,
    overall: {
      totalAmount,
      totalExpense,
      totalSellingAmount: totalSelling,
      totalCost: totalAmount + totalExpense,
      profitOrLoss: totalProfitOrLoss,
      totalGeneralExpense,
      overAllProfitLoss: totalAfterExpense,
      status: overallStatus,
    },
  };
};
