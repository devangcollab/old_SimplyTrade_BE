const express = require("express");
const {
  getAllRepairData,
  createRepair,
  updateRepairData,
  getRepair,
  softDeleteRepair,
} = require("../controllers/repair");
const {
  createRepairData,
  updateRepairDataValidate,
  getRepairValidation,
  deleteRepairValidation,
} = require("../middleware/repair");
const { AuthUser } = require("../middleware/user");

const repairRouter = express.Router();

repairRouter.get("/getAllRepair", AuthUser, getAllRepairData);
repairRouter.get("/getRepair/:id", getRepairValidation, getRepair);
repairRouter.post("/createRepair",AuthUser, createRepairData, createRepair);
repairRouter.put(
  "/updateRepair/:id",
  AuthUser,
  updateRepairDataValidate,
  updateRepairData
);
repairRouter.put("/deleteRepair/:id", AuthUser,deleteRepairValidation, softDeleteRepair);

module.exports = repairRouter;
