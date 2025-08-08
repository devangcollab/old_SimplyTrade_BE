const Account = require("../models/account");

exports.getAllAccountService = async (req) => {
  const search = req.query.search || "";
  const role = req.user.role;
  const userBranchId = req.user.orgBranch;

  const query = { accountName: { $regex: search, $options: "i" } };

  const filter = {
    ...query,
    isDeleted: false,
    ...(role === "user" && { branchName: userBranchId }),
    // you can add more conditions here if needed for other roles
  };

  return await Account.find(filter).populate("organization branchName").lean();
};

exports.getAccountService = async (accountId) => {
  return await Account.findById(accountId)
    .populate("organization branchName")
    .lean();
};

exports.createAccountService = async (newAccount) => {
  return await Account.create(newAccount);
};

exports.updateAccountService = async (accountId, account) => {
  return await Account.findByIdAndUpdate(accountId, account, {
    new: true,
  }).lean();
};

exports.softDeleteAccountService = async (accountId) => {
  return await Account.findByIdAndUpdate(accountId, { isDeleted: true });
};

exports.deleteAccountService = async (accountId) => {
  return await Account.findByIdAndDelete(accountId);
};

exports.selectAccountServices = async (branchId, orgText) => {
  let findObject = { isDeleted: false };

  if (orgText.trim() !== "") {
    findObject.$or = [
      { accountName: { $regex: `^${orgText}`, $options: "i" } },
    ];
  }
  if (branchId) {
    findObject.branchName = branchId;
  }

  return await Account.find(findObject)
    // .populate("organization branchName categoryId")
    .limit(5);
};
