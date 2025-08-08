const Capacity = require("../models/capacity");

exports.getAllCapacityService = async (userId, req) => {
  const page = parseInt(req.query.page) || 1; // Default to page 1
  const limit = parseInt(req.query.limit) || 10; // Default to 10 items per page
  const search = req.query.search || "";

  const skip = (page - 1) * limit;

  const query = { capacityName: { $regex: search, $options: "i" } };

  const items = await Capacity.find({ ...query, isDeleted: false })
    .populate({
      path: "organization",
      match: { userId: userId },
    })
    .populate("organization branchName categoryId modelId deviceId")
    .lean()
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit)
    .lean();

  const totalCount = await Capacity.countDocuments({
    ...query,
    isDeleted: false,
  });

  return { totalCount, items };
};

exports.getCapacityService = async (capId) => {
  return await Capacity.findById(capId)
    .populate("organization branchName categoryId modelId deviceId")
    .lean();
};

exports.createCapacityService = async (newCap) => {
  return await Capacity.create(newCap);
};

exports.updateCapacityService = async (capId, cap) => {
  return await Capacity.findByIdAndUpdate(capId, cap, { new: true }).lean();
};

exports.softDeleteCapacityService = async (capId) => {
  return await Capacity.findByIdAndUpdate(capId, { isDeleted: true });
};

exports.deleteCapacityService = async (capId) => {
  return await Capacity.findByIdAndDelete(capId);
};

exports.searchCapacityService = async (orgText) => {
  let findObject = { isDeleted: false };

  if (orgText.trim() !== "") {
    findObject.$or = [
      { capacityName: { $regex: `^${orgText}`, $options: "i" } },
    ];
  }

  return await Capacity.find(findObject).limit(5); // Increase limit if needed
};

// exports.selectCapacityByDeviceService = async (deviceId) => {
//   return await Capacity.find({ deviceId, isDeleted: false }).lean();
// };

exports.selectCapacityByDeviceService = async (deviceId, text) => {
  let findObject = { isDeleted: false };

  if (text && text.trim() !== "") {
    findObject.$or = [{ capacityName: { $regex: `^${text}`, $options: "i" } }];
  }

  if (deviceId) {
    findObject.deviceId = deviceId;
  }

  return await Capacity.find(findObject)
    .populate("organization branchName categoryId modelId deviceId")
    .limit(5)
    .lean();
};
