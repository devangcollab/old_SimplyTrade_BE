const {
  validateCreateOrganizationBranchData,
} = require("../middleware/organizationBranch");
const {
  getAllOrganizationService,
  getOrganizationService,
  createOrganizationService,
  updateOrganizationService,
  deleteOrganizationService,
  getAllUserOrganizationService,
  softDeleteOrganizationService,
  searchOrganizationService,
  findOrgService,
  paginationService,
} = require("../services/organization");
const {
  createOrganizationBranchServices,
} = require("../services/organizationBranch");
const { createLogActivity } = require("../utils/logActivity");

exports.getAllOrganization = async (req, res) => {
  const userId = req.user.id;

  try {
    const org = await getAllOrganizationService();

    if (!org) {
      return res.status(404).json({ message: "No Organization found" });
    }

    return res.status(200).json({
      message: "Organization retrieved successfully",
      data: org,
    });
  } catch (err) {
    return res
      .status(500)
      .json({ message: "Internal server error", error: err.message });
  }
};

exports.getAllUserOrganization = async (req, res) => {
  try {
    const userId = req.user.id;
    const org = await getAllUserOrganizationService(userId, req);

    if (!org) {
      return res.status(404).json({ message: "No Organization found" });
    }

    return res.status(200).json({
      message: "Organization retrieved successfully",
      data: org,
    });
  } catch (err) {
    return res
      .status(500)
      .json({ message: "Internal server error", error: err.message });
  }
};

exports.getOrganization = async (req, res) => {
  try {
    const orgId = req.params.id;
    const org = await getOrganizationService(orgId);
    if (!org) {
      return res.status(404).json({ message: "No Organization found" });
    }

    return res.status(200).json({
      message: "Organization retrieved successfully",
      data: org,
    });
  } catch (err) {
    return res
      .status(500)
      .json({ message: "Internal server error", error: err.message });
  }
};

exports.createOrganization = async (req, res) => {
  try {
    const newOrg = req.body;
    const newOrgName = req.body.organizationName;
    const userId = req.user.id;

    // Step 1: Create the organization
    const createdOrg = await createOrganizationService({ ...newOrg, userId });

    const {
      _id,
      organizationName,
      primaryAddress,
      addressLine1,
      addressLine2,
      city,
      district,
      state,
      zipCode,
      country,
      telePhone,
      email,
      companyType,
    } = createdOrg;

    const branchData = {
      organization: _id,
      branchName: organizationName, // Default branch name to organization name
      primaryAddress,
      addressLine1,
      addressLine2,
      city,
      district,
      state,
      zipCode,
      country,
      telePhone,
      mobile: telePhone, // Reuse telephone for mobile
      email,
      companyType,
      isDeleted: false,
    };

    // Step 3: Validate and create the branch

    const branchCreated = await createOrganizationBranchServices({
      ...branchData,
      userId,
    });

    if (!branchCreated) {
      return res
        .status(500)
        .json({ message: "Failed to create branch for the organization." });
    }
    await createLogActivity(req, `Organization and branch created`);

    return res.status(200).json({
      message: "Organization and branch created successfully",
      organization: createdOrg,
      branch: branchCreated,
    });
  } catch (err) {
    return res
      .status(500)
      .json({ message: "Internal server error", error: err.message });
  }
};

exports.updateOrganization = async (req, res) => {
  try {
    const orgId = req.params.id;
    const org = req.body;
    const updatedOrg = await updateOrganizationService(orgId, org);
    if (!updatedOrg) {
      return res.status(404).json({ message: "Organization not found" });
    }
    await createLogActivity(req, `Organization update`);

    return res
      .status(200)
      .json({ message: "Organization updated", data: updatedOrg });
  } catch (err) {
    return res
      .status(500)
      .json({ message: "Internal server error", error: err.message });
  }
};

exports.softDeleteOrganization = async (req, res) => {
  try {
    const orgId = req.params.id;
    const org = await softDeleteOrganizationService(orgId);
    if (!org) {
      return res.status(404).json({ message: "Organization not found" });
    }
    await createLogActivity(req, `Organization delete`);

    return res
      .status(200)
      .json({ message: "Organization soft deleted", data: org });
  } catch (err) {
    return res
      .status(500)
      .json({ message: "Internal server error", error: err.message });
  }
};

exports.deleteOrganization = async (req, res) => {
  try {
    const orgId = req.params.id;
    const org = await deleteOrganizationService(orgId);
    if (!org) {
      return res.status(404).json({ message: "Organization not found" });
    }
    return res.status(200).json({ message: "Organization deleted", data: org });
  } catch (err) {
    return res
      .status(500)
      .json({ message: "Internal server error", error: err.message });
  }
};

exports.searchOrganization = async (req, res) => {
  try {
    const orgText = req.query.text || "";
    const userId = req.user.id;

    const org = await searchOrganizationService(orgText, userId);

    if (!org) {
      return res.status(404).json({ message: "searchCustomer not found" });
    }
    return res
      .status(200)
      .json({ message: "searchCustomer searched successfully", data: org });
  } catch (err) {
    return res
      .status(500)
      .json({ message: "Internal server error", error: err.message });
  }
};
