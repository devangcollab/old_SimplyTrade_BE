const Category = require("../models/category");
const UserSchema = require("../models/user");
const mongoose = require("mongoose");

exports.getAllCategoryService = async (userId, req) => {
  const page = parseInt(req.query.page) || 1; // Default to page 1
  const limit = parseInt(req.query.limit) || 10; // Default to 10 items per page
  const search = req.query.search || "";

  const skip = (page - 1) * limit;

  const query = { categoryName: { $regex: search, $options: "i" } };

  const items = await Category.find({ ...query, isDeleted: false })
    .populate({
      path: "orgId orgBranchId",
      match: { userId: userId },
    })
    .lean()
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit)
    .lean();

  const totalCount = await Category.countDocuments({
    ...query,
    isDeleted: false,
  });

  return { totalCount, items };
};

exports.getCategoryService = async (catId) => {
  return await Category.findById(catId).populate("orgId orgBranchId").lean();
};
// FIXME:
exports.getUserCategoryService = async (userId) => {
  return await Category.find({ isDeleted: false, orgId: userId })
    .populate("orgId orgBranchId")
    .lean();
};

exports.createCategoryService = async (newCat) => {
  return await Category.create(newCat);
};

exports.updateCategoryService = async (catId, cat) => {
  return await Category.findByIdAndUpdate(catId, cat, { new: true }).lean();
};

exports.softDeleteCategoryService = async (catId) => {
  return await Category.findByIdAndUpdate(catId, { isDeleted: true });
};

exports.deleteCategoryService = async (catId) => {
  return await Category.findByIdAndDelete(catId);
};

exports.selectCategoryByBranchService = async (branchId, orgText) => {
  let findObject = { isDeleted: false };

  if (orgText && orgText.trim() !== "") {
    findObject.$or = [
      { categoryName: { $regex: `^${orgText}`, $options: "i" } },
    ];
  }

  if (branchId) {
    findObject.orgBranchId = branchId;
  }

  return await Category.find(findObject)
    .populate("orgId orgBranchId")
    .limit(5)
    .lean();
};
