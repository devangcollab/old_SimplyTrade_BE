const Customer = require("../models/customer");

exports.getAllCustomerService = async (userId, role, userBranchId, req) => {
  const page = parseInt(req.query.page) || 1; // Default to page 1
  const limit = parseInt(req.query.limit) || 10; // Default to 10 items per page
  const search = req.query.search || "";

  const skip = (page - 1) * limit;

  const query = { customerName: { $regex: search, $options: "i" } };

  const filter = {
    ...query,
    isDeleted: false,
    ...(role === "user" && { branchName: userBranchId }),
    // you can add more conditions here if needed for other roles
  };

  const data = await Customer.find(filter)
    .populate({
      path: role == "user" ? "branchName" : "organization",
      match: role == "user" ? { _id: userBranchId } : { userId: userId },
    })
    .populate("organization branchName")
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit)
    .lean();

  const totalCount = await Customer.countDocuments(filter);

  return { totalCount, items: data };
};

exports.getCustomerService = async (cusId) => {
  return await Customer.findById(cusId)
    .populate("organization branchName")
    .lean();
};

exports.createCustomerService = async (newCus) => {
  return await Customer.create(newCus);
};

exports.updateCustomerService = async (cusId, cus) => {
  return await Customer.findByIdAndUpdate(cusId, cus, { new: true }).lean();
};
exports.softDeleteCustomerService = async (cusId) => {
  return await Customer.findByIdAndUpdate(cusId, { isDeleted: true });
};

exports.deleteCustomerService = async (cusId) => {
  return await Customer.findByIdAndDelete(cusId).lean();
};

exports.selectCustomerServices = async (branchId, orgText) => {
  let findObject = { isDeleted: false };

  if (orgText && orgText.trim() !== "") {
    findObject.$or = [
      { customerName: { $regex: `^${orgText}`, $options: "i" } },
    ];
  }

  if (branchId) {
    findObject.branchName = branchId;
    findObject.role = "Buyer";
  }

  return await Customer.find(findObject)
    .populate("branchName organization")
    .limit(5)
    .lean();
};

exports.getCustomerByOrgService = async (orgId) => {
  return await Customer.find({ organization: orgId, isDeleted: false }).lean();
};
exports.getCustomerByBranchService = async (branchId) => {
  return await Customer.find({ branchName: branchId, isDeleted: false }).lean();
};

exports.getSellerByOrgService = async (orgId) => {
  return await Customer.find({
    organization: orgId,
    role: "Seller",
    isDeleted: false,
  }).lean();
};
exports.getBuyerByBranchService = async (branchId) => {
  return await Customer.find({
    branchName: branchId,
    role: "Buyer",
    isDeleted: false,
  }).lean();
};
exports.getSellerByBranchService = async (branchId) => {
  return await Customer.find({
    branchName: branchId,
    role: "Seller",
    isDeleted: false,
  }).lean();
};

exports.getBuyerByOrgService = async (orgId) => {
  return await Customer.find({
    organization: orgId,
    role: "Buyer",
    isDeleted: false,
  }).lean();
};
