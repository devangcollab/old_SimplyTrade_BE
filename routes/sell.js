const express = require("express");
const { AuthUser } = require("../middleware/user");
const {
  getAllSell,
  getSell,
  createSell,
  updateSell,
  softDeleteSell,
  getAllStockSellRepair,
  getSellByDate,
} = require("../controllers/sell");
const {
  getSellValidation,
  createSellData,
  updateSellData,
  deleteSellValidation,
} = require("../middleware/sell");

const sellRouter = express.Router();

sellRouter.get("/allSell", AuthUser, getAllSell);
sellRouter.get("/sell/:id", getSellValidation, getSell);
sellRouter.post("/createSell",AuthUser, createSellData, createSell);
sellRouter.put("/updateSell/:id",AuthUser, updateSellData, updateSell);
sellRouter.put("/deleteSell/:id", AuthUser,deleteSellValidation, softDeleteSell);
sellRouter.get("/sellByDate", AuthUser, getSellByDate);

sellRouter.get("/allSellStockRepair", AuthUser, getAllStockSellRepair);

module.exports = sellRouter;
