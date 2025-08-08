const express = require("express");
const {
  getAllExpense,
  getExpense,
  createExpense,
  updateExpense,
  softDeleteExpense,
  getExpenseByDate,
} = require("../controllers/expense");
const {
  createValidation,
  updateOrgValidation,
  deleteOrgValidation,
  getOrgValidation,
} = require("../middleware/expense");
const { AuthUser } = require("../middleware/user");

const expenseRouter = express.Router();

expenseRouter.get("/allExpense", AuthUser, getAllExpense);
expenseRouter.get("/expense/:id", getOrgValidation, getExpense);
expenseRouter.get("/expenseByDate", AuthUser, getExpenseByDate);
expenseRouter.post("/createExpense", AuthUser,createValidation, createExpense);
expenseRouter.put("/updateExpense/:id", AuthUser,updateOrgValidation, updateExpense);
expenseRouter.put("/deleteExpense/:id", AuthUser,deleteOrgValidation, softDeleteExpense);

module.exports = expenseRouter;
