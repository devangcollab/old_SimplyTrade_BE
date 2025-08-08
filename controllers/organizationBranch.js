const {
  findOneOrganizationBranchServices,
  findAllOrganizationBranchServices,
  createOrganizationBranchServices,
  updateOrganizationBranchServices,
  deleteOrganizationBranchServices,
  findUserOrganizationBranchServices,
  softDeleteOrganizationBranchService,
  selectOrganizationBranchServices,
  findOrganizationBranchByOrganizationService,
} = require("../services/organizationBranch");
const { createLogActivity } = require("../utils/logActivity");

exports.findAllOrganizationBranch = async (req, res) => {
  const userId = req.user.id;

  try {
    const organizationBranchData = await findAllOrganizationBranchServices(
      userId
    );

    if (!organizationBranchData) {
      return res.status(404).json({ message: "No Organization Branch found" });
    }

    return res.status(200).json({
      message: "Organization Branch retrieved successfully",
      data: organizationBranchData,
    });
  } catch (err) {
    return res
      .status(500)
      .json({ message: "Internal server error", error: err.message });
  }
};

exports.findOneOrganizationBranch = async (req, res) => {
  try {
    const organizationBranchId = req.params.id;

    const organizationBranchData = await findOneOrganizationBranchServices(
      organizationBranchId
    );

    if (!organizationBranchData) {
      return res.status(404).json({ message: "No Organization Branch found" });
    }

    return res.status(200).json({
      message: "Organization Branch retrieved successfully",
      data: organizationBranchData,
    });
  } catch (err) {
    return res
      .status(500)
      .json({ message: "Internal server error", error: err.message });
  }
};

exports.findUserOrganizationBranch = async (req, res) => {
  try {
    const userId = req?.user?.id;
    const organizationBranchData = await findUserOrganizationBranchServices(
      userId,
      req
    );

    if (!organizationBranchData) {
      return res.status(404).json({ message: "No OrganizationBranch found" });
    }

    return res.status(200).json({
      message: "OrganizationBranch retrieved successfully",
      data: organizationBranchData,
    });
  } catch (err) {
    return res
      .status(500)
      .json({ message: "Internal server error", error: err.message });
  }
};
exports.selectOrganizationBranch = async (req, res) => {
  try {
    const orgId = req?.params?.id;
    const orgText = req?.query?.text || "";

    const organizationBranchData = await selectOrganizationBranchServices(
      orgId,
      orgText
    );

    if (!organizationBranchData) {
      return res.status(404).json({ message: "No OrganizationBranch found" });
    }

    return res.status(200).json({
      message: "OrganizationBranch retrieved successfully",
      data: organizationBranchData,
    });
  } catch (err) {
    return res
      .status(500)
      .json({ message: "Internal server error", error: err.message });
  }
};

exports.createOrganizationBranch = async (req, res) => {
  try {
    const data = req.body;
    const userId = req.user.id;
    const organizationBranchData = await createOrganizationBranchServices({
      ...data,
      userId,
    });
    await createLogActivity(req, ` branch created`);

    return res.status(200).json({
      message: "OrganizationBranch created",
      data: organizationBranchData,
    });
  } catch (err) {
    return res
      .status(500)
      .json({ message: "Internal server error", error: err.message });
  }
};

exports.updateOrganizationBranch = async (req, res) => {
  try {
    const organizationBranchId = req.params.id;

    const data = req.body;
    const organizationBranchData = await updateOrganizationBranchServices(
      organizationBranchId,
      data
    );
    if (!organizationBranchData) {
      return res.status(404).json({ message: "OrganizationBranch not found" });
    }
    await createLogActivity(req, ` branch update`);

    return res.status(200).json({
      message: "OrganizationBranch updated",
      data: organizationBranchData,
    });
  } catch (err) {
    return res
      .status(500)
      .json({ message: "Internal server error", error: err.message });
  }
};

exports.softDeleteOrganizationBranch = async (req, res) => {
  try {
    const organizationBranchId = req.params.id;
    const organizationBranchData = await softDeleteOrganizationBranchService(
      organizationBranchId
    );
    if (!organizationBranchData) {
      return res.status(404).json({ message: "OrganizationBranch not found" });
    }
    await createLogActivity(req, ` branch delete`);

    return res.status(200).json({
      message: "OrganizationBranch soft deleted",
      data: organizationBranchData,
    });
  } catch (err) {
    return res
      .status(500)
      .json({ message: "Internal server error", error: err.message });
  }
};

exports.deleteOrganizationBranch = async (req, res) => {
  try {
    const organizationBranchId = req.params.id;
    const organizationBranchData = await deleteOrganizationBranchServices(
      organizationBranchId
    );
    if (!organizationBranchData) {
      return res.status(404).json({ message: "OrganizationBranch not found" });
    }
    return res.status(200).json({
      message: "OrganizationBranch deleted",
      data: organizationBranchData,
    });
  } catch (err) {
    return res
      .status(500)
      .json({ message: "Internal server error", error: err.message });
  }
};
exports.findOrganizationBranchByOrganization = async (req, res) => {
  const organizationId = req.params.id;

  try {
    const organizationBranchData =
      await findOrganizationBranchByOrganizationService(organizationId);

    if (!organizationBranchData) {
      return res.status(404).json({ message: "No Organization Branch found" });
    }

    return res.status(200).json({
      message: "Organization Branch retrieved successfully",
      data: organizationBranchData,
    });
  } catch (err) {
    return res
      .status(500)
      .json({ message: "Internal server error", error: err.message });
  }
};
