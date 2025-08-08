const express = require("express");
const { getProfitLoss } = require("../controllers/profitLoss");
const { AuthUser } = require("../middleware/user");

const profitLossRouter = express.Router();

profitLossRouter.get("/profitLoss", AuthUser, getProfitLoss);

module.exports = profitLossRouter;
