const express = require("express");
const {
  getAllCategory,
  getCategory,
  createCategory,
  updateCategory,
  softDeleteCategory,
  getUserCategory,
  searchCategory,
  selectCategory,
} = require("../controllers/category");
const {
  categoryIdValidation,
  createCategoryValidation,
  updateCategoryValidation,
} = require("../middleware/category");
const { AuthUser } = require("../middleware/user");

const catRouter = express.Router();

catRouter.get("/allCategory", AuthUser, getAllCategory);
catRouter.get("/userCategory", AuthUser, getUserCategory);
catRouter.get("/searchCategory", searchCategory);
catRouter.get("/category/:id", categoryIdValidation, getCategory);
catRouter.get("/selectCategoryByBranch/:id", selectCategory);
catRouter.post("/createCategory", AuthUser,createCategoryValidation, createCategory);
catRouter.put("/updateCategory/:id",AuthUser, updateCategoryValidation, updateCategory);
catRouter.put("/deleteCategory/:id", AuthUser,categoryIdValidation, softDeleteCategory);

module.exports = catRouter;
