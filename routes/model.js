const express = require("express");
const {
  findAllModel,
  deleteModel,
  updateModel,
  findOneModel,
  createModel,
  softDeleteModel,
  selectModelByCat,
  searchModel,
  selectModelByBranch,
} = require("../controllers/model");
const {
  validateGetOneModelData,
  validateCreateModelData,
  validateUpdateModelData,
  validateDeleteModelData,
} = require("../middleware/model");
const { AuthUser } = require("../middleware/user");
const modelRoute = express.Router();

modelRoute.get("/findAllModel", AuthUser, findAllModel);
modelRoute.get("/findOneModel/:id", validateGetOneModelData, findOneModel);
modelRoute.get(
  "/selectModelByCat/:id",
  validateGetOneModelData,
  selectModelByCat
);
modelRoute.post("/createModel", AuthUser, validateCreateModelData, createModel);
modelRoute.put(
  "/updateModel/:id",
  AuthUser,
  validateUpdateModelData,
  updateModel
);
modelRoute.put(
  "/deleteModel/:id",
  AuthUser,
  validateDeleteModelData,
  softDeleteModel
);
modelRoute.get("/selectModelByBranch/:id", selectModelByBranch);

module.exports = modelRoute;
