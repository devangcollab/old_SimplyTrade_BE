const { body, param, validationResult } = require("express-validator");

// Create OrganizationBranch Validation
exports.validateCreateOrganizationBranchData = [
  body("organization")
    .isMongoId()
    .withMessage("Organization ID must be a valid MongoDB ObjectId"),
  body("branchName")
    .isString()
    .notEmpty()
    .withMessage("Branch name must be a non-empty string"),
  body("primaryAddress")
    .isString()
    .notEmpty()
    .withMessage("Primary address must be a non-empty string"),
  body("addressLine1")
    .isString()
    .notEmpty()
    .withMessage("Address line 1 must be a non-empty string"),
  body("city")
    .isString()
    .notEmpty()
    .withMessage("City must be a non-empty string"),
  body("district")
    .isString()
    .notEmpty()
    .withMessage("District must be a non-empty string"),
  body("state")
    .isString()
    .notEmpty()
    .withMessage("State must be a non-empty string"),
  body("zipCode")
    .isString()
    .notEmpty()
    .withMessage("Zip code must be a non-empty string"),
  body("country")
    .isString()
    .notEmpty()
    .withMessage("Country must be a non-empty string"),
  body("telePhone")
    .isString()
    .notEmpty()
    .withMessage("Telephone must be a non-empty string"),
  body("mobile")
    .isString()
    .notEmpty()
    .withMessage("Mobile number must be a non-empty string"),
  body("email").isEmail().withMessage("Email must be a valid email address"),
  body("companyType")
    .isString()
    .notEmpty()
    .withMessage("Company type must be a non-empty string"),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  },
];

// Get OrganizationBranch by ID Validation
exports.validateGetOneOrganizationBranchData = [
  param("id").isMongoId().withMessage("Valid OrganizationBranch ID required"),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  },
];

// Delete OrganizationBranch Validation
exports.validateDeleteOrganizationBranchData = [
  param("id").isMongoId().withMessage("Valid OrganizationBranch ID required"),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  },
];

// Update OrganizationBranch Validation
exports.validateUpdateOrganizationBranchData = [
  param("id").isMongoId().withMessage("Valid OrganizationBranch ID required"),
  body("branchName")
    .optional()
    .isString()
    .withMessage("Branch name must be a string"),
  body("primaryAddress")
    .optional()
    .isString()
    .withMessage("Primary address must be a string"),
  body("addressLine1")
    .optional()
    .isString()
    .withMessage("Address line 1 must be a string"),
  body("city").optional().isString().withMessage("City must be a string"),
  body("district")
    .optional()
    .isString()
    .withMessage("District must be a string"),
  body("state").optional().isString().withMessage("State must be a string"),
  body("zipCode")
    .optional()
    .isString()
    .withMessage("Zip code must be a string"),
  body("country").optional().isString().withMessage("Country must be a string"),
  body("telePhone")
    .optional()
    .isString()
    .withMessage("Telephone must be a string"),
  body("mobile")
    .optional()
    .isString()
    .withMessage("Mobile number must be a string"),
  body("email")
    .optional()
    .isEmail()
    .withMessage("Email must be a valid email address"),
  body("companyType")
    .optional()
    .isString()
    .withMessage("Company type must be a string"),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  },
];
