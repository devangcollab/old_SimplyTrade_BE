const express = require("express");
const {
  findAllOrganizationBranch,
  updateOrganizationBranch,
  findOneOrganizationBranch,
  createOrganizationBranch,
  findUserOrganizationBranch,
  softDeleteOrganizationBranch,
  selectOrganizationBranch,
  findOrganizationBranchByOrganization,
} = require("../controllers/organizationBranch");
const {
  validateCreateOrganizationBranchData,
  validateUpdateOrganizationBranchData,
  validateDeleteOrganizationBranchData,
} = require("../middleware/organizationBranch");
const { AuthUser } = require("../middleware/user");
const { searchOrganization } = require("../controllers/organization");
const organizationBranchRoute = express.Router();

organizationBranchRoute.get(
  "/findAllOrganizationBranch",
  AuthUser,
  findAllOrganizationBranch
);
organizationBranchRoute.get(
  "/findAllUserOrganizationBranch",
  AuthUser,
  findUserOrganizationBranch
);

organizationBranchRoute.get(
  "/findOneOrganizationBranch/:id",
  AuthUser,
  findOneOrganizationBranch
);

organizationBranchRoute.get(
  "/findOrgBranchByOrg/:id",
  AuthUser,
  findOrganizationBranchByOrganization
);
organizationBranchRoute.get(
  "/selectOrganizationBranch/:id",
  AuthUser,
  selectOrganizationBranch
);

organizationBranchRoute.post(
  "/createOrganizationBranch",
  AuthUser,
  validateCreateOrganizationBranchData,
  createOrganizationBranch
);
organizationBranchRoute.put(
  "/updateOrganizationBranch/:id",
  AuthUser,
  validateUpdateOrganizationBranchData,
  updateOrganizationBranch
);
organizationBranchRoute.put(
  "/deleteOrganizationBranch/:id",
  AuthUser,
  validateDeleteOrganizationBranchData,
  softDeleteOrganizationBranch
);

module.exports = organizationBranchRoute;
