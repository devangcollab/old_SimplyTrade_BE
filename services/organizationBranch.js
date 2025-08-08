const OrganizationBranch = require("../models/organizationBranch");

exports.findAllOrganizationBranchServices = async () => {
  const data = await OrganizationBranch.find({ isDeleted: false })
    .populate("userId branchName organization")
    .lean();

  return data;
};
exports.findOneOrganizationBranchServices = async (id) => {
  const data = await OrganizationBranch.findById(id)
    .populate("userId branchName organization")
    .lean();

  return data;
};
exports.findUserOrganizationBranchServices = async (userId, req) => {
  const page = parseInt(req.query.page) || 1; // Default to page 1
  const limit = parseInt(req.query.limit) || 10; // Default to 10 items per page
  const search = req.query.search || "";

  const skip = (page - 1) * limit;

  const query = { branchName: { $regex: search, $options: "i" } };

  const items = await OrganizationBranch.find({
    userId,
    ...query,
    isDeleted: false,
  })
    .sort({ createdAt: -1 })
    .populate("userId organization")
    .skip(skip)
    .limit(limit)
    .lean();

  const totalCount = await OrganizationBranch.countDocuments({
    userId,
    ...query,
    isDeleted: false,
  });

  return { totalCount, items };
};

exports.selectOrganizationBranchServices = async (orgId, orgText) => {
  let findObject = { isDeleted: false };

  if (orgText.trim() !== "") {
    findObject.$or = [{ branchName: { $regex: `^${orgText}`, $options: "i" } }];
  }
  if (orgId) {
    findObject.organization = orgId;
  }

  return await OrganizationBranch.find(findObject).populate(
    "userId branchName"
  );
};

exports.createOrganizationBranchServices = async (branchData) => {
  const data = await OrganizationBranch.create(branchData);
  return data;
};

exports.updateOrganizationBranchServices = async (branchId, branchData) => {
  const data = await OrganizationBranch.findByIdAndUpdate(
    branchId,
    branchData,
    { new: true }
  ).lean();
  return data;
};

exports.softDeleteOrganizationBranchService = async (branchId) => {
  return await OrganizationBranch.findByIdAndUpdate(branchId, {
    isDeleted: true,
  });
};

exports.deleteOrganizationBranchServices = async (OrganizationBranchId) => {
  const data = await OrganizationBranch.findByIdAndDelete(
    OrganizationBranchId
  ).lean();
  return data;
};

exports.findOrganizationBranchByOrganizationService = async (
  organizationId
) => {
  const data = await OrganizationBranch.find({
    organization: organizationId,
    isDeleted: false,
  })
    .populate("userId branchName organization")
    .lean();

  return data;
};
