const express = require("express");
const {
  getAllLogActivity,
  createLogActivity,
} = require("../utils/logActivity");
const { AuthUser } = require("../middleware/user");
const activityLogRouter = express.Router();

activityLogRouter.get("/getActivityLog", AuthUser, getAllLogActivity);
activityLogRouter.post("/createActivityLog", AuthUser, createLogActivity);

module.exports = activityLogRouter;