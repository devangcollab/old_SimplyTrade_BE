const Repair = require("../models/repair");

exports.getAllRepairDataServices = async (userOrgId, role, userId, req) => {
  const page = parseInt(req.query.page) || 1; // Default to page 1
  const limit = parseInt(req.query.limit) || 10; // Default to 10 items per page

  const search = req.query?.search || "";

  const skip = (page - 1) * limit;

  const query = { email: { $regex: search, $options: "i" } };

  const data = await Repair.find({ ...query, isDeleted: false })
    .populate({
      path: "organization",
      match: role == "user" ? { _id: userOrgId } : { userId: userId },
    })
    .populate("branch customerName modelName deviceName")
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit)
    .lean();
  const filterData = data.filter((item) => {
    return item.organization != null;
  });

  const totalCount = await Repair.countDocuments({
    ...query,
    isDeleted: false,
  });

  return { totalCount, items: filterData };
};

exports.createRepairService = async (newData) => {
  return await Repair.create(newData);
};

exports.updateRepairServices = async (repairId, repair) => {
  const deviceData = repair && repair.device && repair.device[0];

  const data = await Repair.findByIdAndUpdate(
    repairId,
    {
      organization: repair.organization,
      branch: repair.branch,
      customerName: repair.customerName,
      customerPhone: repair.customerPhone,
      email: repair.email,
      modelName: deviceData.modelName,
      deviceName: deviceData.deviceName,
      amount: deviceData.amount,
      estimatedCost: deviceData.estimatedCost,
      status: deviceData.status,
      date: deviceData.date,
    },
    { new: true }
  );

  return data;
};

exports.getRepairService = async (repairId) => {
  return await Repair.findById(repairId)
    .populate("organization branch customerName modelName deviceName")
    .lean();
};

exports.softDeleteRepairService = async (repairId) => {
  return await Repair.findByIdAndUpdate(repairId, { isDeleted: true });
};

exports.deleteRepairService = async (repairId) => {
  return await Repair.findByIdAndDelete(repairId);
};
