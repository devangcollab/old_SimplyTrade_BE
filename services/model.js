const Model = require("../models/model");

exports.findAllModelServices = async (userId, req) => {
  const page = parseInt(req.query.page) || 1; // Default to page 1
  const limit = parseInt(req.query.limit) || 10; // Default to 10 items per page
  const search = req.query.search || "";

  const skip = (page - 1) * limit;

  const query = { modelName: { $regex: search, $options: "i" } };

  const items = await Model.find({ ...query, isDeleted: false })
    .populate({ path: "organization", match: { userId: userId } })
    .populate("branchName categoryId")
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit)
    .lean();

  const totalCount = await Model.countDocuments({ ...query, isDeleted: false });

  return { totalCount, items };
};
exports.findOneModelServices = async (modelId) => {
  const data = await Model.findById(modelId)
    .populate("organization branchName categoryId")
    .lean();

  return data;
};
exports.selectModelByCatServices = async (catId, orgText) => {
  let findObject = { isDeleted: false };

  if (orgText.trim() !== "") {
    findObject.$or = [{ modelName: { $regex: `^${orgText}`, $options: "i" } }];
  }
  if (catId) {
    findObject.categoryId = catId;
  }

  return await Model.find(findObject)
    .populate("organization branchName categoryId")
    .limit(5); // Increase limit if needed
};
exports.findUserModelServices = async (userId) => {
  const data = await Model.find().populate().lean();
  return data;
};

exports.createModelServices = async (modelData) => {
  const data = await Model.create(modelData);

  return data;
};

exports.updateModelServices = async (modelId, modelData) => {
  const data = await Model.findByIdAndUpdate(modelId, modelData, {
    new: true,
  }).lean();
  return data;
};

exports.softDeleteModelService = async (modelId) => {
  return await Model.findByIdAndUpdate(modelId, { isDeleted: true });
};

exports.deleteModelServices = async (modelId) => {
  const data = await Model.findByIdAndDelete(modelId).lean();
  return data;
};

exports.selectModelByBranchServices = async (branchId, orgText) => {
  let findObject = { isDeleted: false };

  if (orgText.trim() !== "") {
    findObject.$or = [{ modelName: { $regex: `^${orgText}`, $options: "i" } }];
  }
  if (branchId) {
    findObject.branchName = branchId;
  }

  return await Model.find(findObject)
    .populate("organization branchName categoryId")
    .limit(5);
};
