const Sell = require("../models/sell");
const Stock = require("../models/stock");
const Repair = require("../models/repair");

const getLedgerData = async (req) => {
  const { userId, role, userOrgId, orgBranch } = req.user || {}; // Assuming auth middleware sets `req.user`
  const skip = 0;
  const limit = 1000; // or any limit you want for PDF

  const sellData = await Sell.find({ isDeleted: false })
    .populate({
      path: "organization",
      match: role === "user" ? { _id: userOrgId } : { userId },
    })
    .populate("branch customerName modelName deviceName")
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit)
    .lean();

  const stockData = await Stock.find({ isDeleted: false })
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

  const repairData = await Repair.find({ isDeleted: false })
    .populate({
      path: "organization",
      match: role === "user" ? { _id: userOrgId } : { userId },
    })
    .populate("branch customerName modelName deviceName")
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit)
    .lean();

  return { sellData, stockData, repairData };
};

module.exports = {
  getLedgerData,
};
