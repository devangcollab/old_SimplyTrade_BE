const {
  getAllCategoryService,
  getCategoryService,
  createCategoryService,
  updateCategoryService,
  deleteCategoryService,
  softDeleteCategoryService,
  selectCategoryByBranchService,
  getUserCategoryService,
  searchCategoryService,
} = require("../services/category");
const { createLogActivity } = require("../utils/logActivity");

exports.getAllCategory = async (req, res) => {
  try {
    const userId = req.user.id;

    const cat = await getAllCategoryService(userId, req);
    if (!cat) {
      return res.status(404).json({ message: "No category found" });
    }
    return res.status(200).json({
      message: "category retrieved successfully",
      data: cat,
    });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Internal server error", error: error.message });
  }
};

exports.getCategory = async (req, res) => {
  try {
    const catId = req.params.id;
    const cat = await getCategoryService(catId);
    if (!cat) {
      return res.status(404).json({ message: "No category found" });
    }
    return res.status(200).json({
      message: "category retrieved successfully",
      data: cat,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
// FIXME:
exports.getUserCategory = async (req, res) => {
  try {
    const userId = req.user.id;
    const cat = await getUserCategoryService(userId, req);
    if (!cat) {
      return res.status(404).json({ message: "No category found" });
    }
    return res.status(200).json({
      message: "category retrieved successfully",
      data: cat,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.createCategory = async (req, res) => {
  try {
    const newCat = req.body;

    const createdCat = await createCategoryService(newCat);
    await createLogActivity(req, `Created Category`);

    return res
      .status(200)
      .json({ message: "Category added", data: createdCat });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Internal server error", error: error.message });
  }
};

exports.updateCategory = async (req, res) => {
  try {
    const catId = req.params.id;
    const cat = req.body;
    const updatedCat = await updateCategoryService(catId, cat);
    if (!updatedCat) {
      return res.status(404).json({ message: "category not found" });
    }
    await createLogActivity(req, `updated Category`);

    return res
      .status(200)
      .json({ message: "category updated", data: updatedCat });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Internal server error", error: error.message });
  }
};

exports.softDeleteCategory = async (req, res) => {
  try {
    const catId = req.params.id;
    const cat = await softDeleteCategoryService(catId);
    if (!cat) {
      return res.status(404).json({ message: "category not found" });
    }
    await createLogActivity(req, `delete Category`);

    return res
      .status(200)
      .json({ message: "category soft deleted", data: cat });
  } catch (err) {
    return res
      .status(500)
      .json({ message: "Internal server error", error: err.message });
  }
};

exports.deleteCategory = async (req, res) => {
  try {
    const catId = req.params.id;
    const cat = await deleteCategoryService(catId);
    if (!cat) {
      return res.status(404).json({ message: "category not found" });
    }

    return res.status(200).json({ message: "category deleted", data: cat });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Internal server error", error: error.message });
  }
};

exports.searchCategory = async (req, res) => {
  try {
    const orgText = req.query.text || "";

    const org = await searchCategoryService(orgText);

    if (!org) {
      return res.status(404).json({ message: "searchCategory not found" });
    }
    return res
      .status(200)
      .json({ message: "searchCategory searched successfully", data: org });
  } catch (err) {
    return res
      .status(500)
      .json({ message: "Internal server error", error: err.message });
  }
};

exports.selectCategory = async (req, res) => {
  try {
    const branchId = req?.params?.id;
    const orgText = req?.query?.text || "";

    if (!branchId && !orgText) {
      return res.status(400).json({
        message: "Please provide either branchId or orgText for filtering.",
      });
    }

    const Data = await selectCategoryByBranchService(branchId, orgText);

    if (!Data || Data.length === 0) {
      return res.status(404).json({ message: "No found" });
    }

    return res.status(200).json({
      message: " data retrieved successfully",
      data: Data,
    });
  } catch (err) {
    return res
      .status(500)
      .json({ message: "Internal server error", error: err.message });
  }
};
