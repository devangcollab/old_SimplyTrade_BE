const express = require("express");
const { exportLedgerPdf } = require("../controllers/cusLeadger");

const cusLeaderRouter = express.Router();

cusLeaderRouter.get("/export-ledger", exportLedgerPdf);

module.exports = cusLeaderRouter;
