const express = require("express");
const {
  getAllCustomer,
  getCustomer,
  createCustomer,
  updateCustomer,
  deleteCustomer,
  softDeleteCustomer,
  searchCustomer,
  selectCustomer,
  selectCustomerTest,
  getCustomerByOrg,
  getSellerByOrg,
  getBuyerByOrg,
  getSellerByBranch,
  getBuyerByBranch,
  getCustomerByBranch
} = require("../controllers/customer");
const {
  customerIdValidation,
  createCustomerValidation,
  updateCustomerValidation,
} = require("../middleware/customer");
const { AuthUser } = require("../middleware/user");

const cusRouter = express.Router();

cusRouter.get("/allCustomer", AuthUser, getAllCustomer);
// cusRouter.get("/searchCustomer", searchCustomer);

cusRouter.get("/selectCustomer/:id", selectCustomer);
cusRouter.get("/customer/:id", customerIdValidation, getCustomer);
cusRouter.post("/createCustomer",AuthUser, createCustomerValidation, createCustomer);
cusRouter.put("/updateCustomer/:id", AuthUser,updateCustomerValidation, updateCustomer);
cusRouter.put("/deleteCustomer/:id",AuthUser, customerIdValidation, softDeleteCustomer);
cusRouter.get("/getCustomerByOrg/:id", getCustomerByOrg);
cusRouter.get("/getCustomerByBranch/:id", getCustomerByBranch);
cusRouter.get("/getSellerByOrg/:id", getSellerByOrg);
cusRouter.get("/getSellerByBranch/:id", getSellerByBranch);
cusRouter.get("/getBuyerByBranch/:id", getBuyerByBranch);
cusRouter.get("/getBuyerByOrg/:id", getBuyerByOrg);

module.exports = cusRouter;
