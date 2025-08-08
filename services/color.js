const Color = require("../models/color");

exports.findAllColorServices = async (userId, req) => {
  const page = parseInt(req.query.page) || 1; // Default to page 1
  const limit = parseInt(req.query.limit) || 10; // Default to 10 items per page
  const search = req.query.search || "";

  const skip = (page - 1) * limit;

  const query = { colorName: { $regex: search, $options: "i" } };

  const items = await Color.find({ ...query, isDeleted: false })
    .populate({
      path: "organization branchName",
      match: { userId: userId },
    })
    .populate("categoryId modelId deviceId")
    .lean()
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit)
    .lean();

  const totalCount = await Color.countDocuments({ ...query, isDeleted: false });

  return { totalCount, items };
};
exports.findOneColorServices = async (colorId) => {
  const data = await Color.findById(colorId)
    .populate("categoryId modelId deviceId organization branchName")
    .lean();

  return data;
};
exports.findUserColorServices = async (userId) => {
  const data = await Color.find().populate().lean();
  return data;
};

exports.createColorServices = async (colorData) => {
  const data = await Color.create(colorData);
  return data;
};

exports.updateColorServices = async (colorId, colorData) => {
  const data = await Color.findByIdAndUpdate(colorId, colorData, {
    new: true,
  }).lean();
  return data;
};

exports.softDeleteColorService = async (colorId) => {
  return await Color.findByIdAndUpdate(colorId, { isDeleted: true });
};

exports.deleteColorServices = async (colorId) => {
  const data = await Color.findByIdAndDelete(colorId).lean();
  return data;
};

exports.searchColorServices = async (orgText) => {
  let findObject = { isDeleted: false };

  if (orgText.trim() !== "") {
    findObject.$or = [{ colorName: { $regex: `^${orgText}`, $options: "i" } }];
  }

  return await Color.find(findObject).limit(5); // Increase limit if needed
};

exports.selectColorByDeviceServices = async (deviceId, orgText) => {
  let findObject = { isDeleted: false };

  if (orgText && orgText.trim() !== "") {
    findObject.$or = [{ colorName: { $regex: `^${orgText}`, $options: "i" } }];
  }

  if (deviceId) {
    findObject.deviceId = deviceId;
  }

  return await Color.find(findObject)
    .populate("categoryId modelId deviceId organization branchName")
    .limit(5)
    .lean();
};
