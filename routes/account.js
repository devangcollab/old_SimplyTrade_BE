const express = require("express");
const {
  getAllAccount,
  getAccount,
  createAccount,
  updateAccount,
  selectAccountByBranch,
  softDeleteAccount,
} = require("../controllers/account");
const { AuthUser } = require("../middleware/user");

const accountRouter = express.Router();

accountRouter.get("/allAccount", AuthUser, getAllAccount);
accountRouter.get("/account/:id", getAccount);
accountRouter.post("/createAccount",AuthUser, createAccount);
accountRouter.put("/updateAccount/:id",AuthUser, updateAccount);
accountRouter.put("/deleteAccount/:id",AuthUser, softDeleteAccount);
accountRouter.get("/selectAccountByBranch", selectAccountByBranch);

module.exports = accountRouter;
