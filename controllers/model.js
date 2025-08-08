const {
  findOneModelServices,
  findAllModelServices,
  createModelServices,
  updateModelServices,
  deleteModelServices,
  findUserModelServices,
  softDeleteModelService,
  selectModelByCatServices,
  selectModelByBranchServices,
} = require("../services/model");
const { createLogActivity } = require("../utils/logActivity");

exports.findAllModel = async (req, res) => {
  try {
    const userId = req?.user?.id;
    const modelData = await findAllModelServices(userId, req);

    if (!modelData) {
      return res.status(404).json({ message: "No Model found" });
    }

    return res.status(200).json({
      message: "Model retrieved successfully",
      data: modelData,
    });
  } catch (err) {
    return res
      .status(500)
      .json({ message: "Internal server error", error: err.message });
  }
};

exports.findOneModel = async (req, res) => {
  try {
    const modelId = req.params.id;
    const modelData = await findOneModelServices(modelId);

    if (!modelData) {
      return res.status(404).json({ message: "No Model found" });
    }

    return res.status(200).json({
      message: "Model retrieved successfully",
      data: modelData,
    });
  } catch (err) {
    return res
      .status(500)
      .json({ message: "Internal server error", error: err.message });
  }
};
exports.selectModelByCat = async (req, res) => {
  try {
    const catId = req.params.id;
    const orgText = req?.query?.text || "";
    const modelData = await selectModelByCatServices(catId, orgText);

    if (!modelData) {
      return res.status(404).json({ message: "No Model found" });
    }

    return res.status(200).json({
      message: "Model retrieved successfully",
      data: modelData,
    });
  } catch (err) {
    return res
      .status(500)
      .json({ message: "Internal server error", error: err.message });
  }
};

exports.findUserModel = async (req, res) => {
  try {
    const userId = req?.user?.id;
    const modelData = await findUserModelServices(userId);

    if (!modelData) {
      return res.status(404).json({ message: "No Model found" });
    }

    return res.status(200).json({
      message: "Model retrieved successfully",
      data: modelData,
    });
  } catch (err) {
    return res
      .status(500)
      .json({ message: "Internal server error", error: err.message });
  }
};

exports.createModel = async (req, res) => {
  try {
    const data = req.body;
    const modelData = await createModelServices(data);
    if (!modelData) {
      return res.status(404).json({ message: "No Model found" });
    }
    await createLogActivity(req, `Created model`);

    return res.status(200).json({ message: "Model created", data: modelData });
  } catch (err) {
    return res
      .status(500)
      .json({ message: "Internal server error", error: err.message });
  }
};

exports.updateModel = async (req, res) => {
  try {
    const modelId = req.params.id;

    const data = req.body;
    const modelData = await updateModelServices(modelId, data);
    if (!modelData) {
      return res.status(404).json({ message: "Model not found" });
    }
    await createLogActivity(req, `update model`);

    return res.status(200).json({ message: "Model updated", data: modelData });
  } catch (err) {
    return res
      .status(500)
      .json({ message: "Internal server error", error: err.message });
  }
};

exports.softDeleteModel = async (req, res) => {
  try {
    const modelId = req.params.id;
    const data = await softDeleteModelService(modelId);
    if (!data) {
      return res.status(404).json({ message: "Model not found" });
    }
    await createLogActivity(req, `delete model`);

    return res.status(200).json({ message: "Model soft deleted", data });
  } catch (err) {
    return res
      .status(500)
      .json({ message: "Internal server error", error: err.message });
  }
};

exports.deleteModel = async (req, res) => {
  try {
    const modelId = req.params.id;
    const modelData = await deleteModelServices(modelId);
    if (!modelData) {
      return res.status(404).json({ message: "Model not found" });
    }
    return res.status(200).json({ message: "Model deleted", data: modelData });
  } catch (err) {
    return res
      .status(500)
      .json({ message: "Internal server error", error: err.message });
  }
};

exports.selectModelByBranch = async (req, res) => {
  try {
    const branchId = req.params.id;
    const orgText = req?.query?.text || "";

    const modelData = await selectModelByBranchServices(branchId, orgText);

    if (!modelData) {
      return res.status(404).json({ message: "No Model found" });
    }

    return res.status(200).json({
      message: "Model retrieved successfully",
      data: modelData,
    });
  } catch (err) {
    return res
      .status(500)
      .json({ message: "Internal server error", error: err.message });
  }
};
