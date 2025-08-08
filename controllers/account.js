const {
  getAllAccountService,
  getAccountService,
  createAccountService,
  updateAccountService,
  softDeleteAccountService,
  deleteAccountService,
  selectAccountServices,
} = require("../services/account");
const { createLogActivity } = require("../utils/logActivity");

exports.getAllAccount = async (req, res) => {
  try {
    const Account = await getAllAccountService(req);

    if (!Account) {
      return res.status(404).json({ message: "No Account found" });
    }

    return res.status(200).json({
      message: "Account retrieved successfully",
      data: Account,
    });
  } catch (err) {
    return res
      .status(500)
      .json({ message: "Internal server error", error: err.message });
  }
};

exports.getAccount = async (req, res) => {
  try {
    const accountId = req.params.id;
    const Account = await getAccountService(accountId);
    if (!Account) {
      return res.status(404).json({ message: "No Account found" });
    }

    return res.status(200).json({
      message: "Account retrieved successfully",
      data: Account,
    });
  } catch (err) {
    return res
      .status(500)
      .json({ message: "Internal server error", error: err.message });
  }
};

exports.createAccount = async (req, res) => {
  try {
    const newAccount = req.body;
    const createdAccount = await createAccountService(newAccount);

    await createLogActivity(req, `Created account`);

    return res
      .status(200)
      .json({ message: "Account created", data: createdAccount });
  } catch (err) {
    return res
      .status(500)
      .json({ message: "Internal server error", error: err.message });
  }
};

exports.updateAccount = async (req, res) => {
  try {
    const accountId = req.params.id;
    const account = req.body;
    const updatedAccount = await updateAccountService(accountId, account);
    if (!updatedAccount) {
      return res.status(404).json({ message: "Account not found" });
    }

    await createLogActivity(req, `Updated account`);

    return res
      .status(200)
      .json({ message: "Account updated", data: updatedAccount });
  } catch (err) {
    return res
      .status(500)
      .json({ message: "Internal server error", error: err.message });
  }
};

exports.softDeleteAccount = async (req, res) => {
  try {
    const accountId = req.params.id;
    const Account = await softDeleteAccountService(accountId);
    if (!Account) {
      return res.status(404).json({ message: "Account not found" });
    }

    await createLogActivity(req, `Soft deleted account`);

    return res
      .status(200)
      .json({ message: "Account soft deleted", data: Account });
  } catch (err) {
    return res
      .status(500)
      .json({ message: "Internal server error", error: err.message });
  }
};

exports.deleteAccount = async (req, res) => {
  try {
    const accountId = req.params.id;
    const Account = await deleteAccountService(accountId);
    if (!Account) {
      return res.status(404).json({ message: "Account not found" });
    }

    await createLogActivity(req, `Deleted account`);

    return res.status(200).json({ message: "Account deleted", data: Account });
  } catch (err) {
    return res
      .status(500)
      .json({ message: "Internal server error", error: err.message });
  }
};

exports.selectAccountByBranch = async (req, res) => {
  try {
    const branchId = req.query.branchId;
    const orgText = req?.query?.text || "";

    const accountData = await selectAccountServices(branchId, orgText);

    if (!accountData) {
      return res.status(404).json({ message: "No Account found" });
    }

    return res.status(200).json({
      message: "Account retrieved successfully",
      data: accountData,
    });
  } catch (err) {
    return res
      .status(500)
      .json({ message: "Internal server error", error: err.message });
  }
};
