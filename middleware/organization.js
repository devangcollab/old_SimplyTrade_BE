const { body, param, validationResult } = require("express-validator");

const jwt = require("jsonwebtoken");

exports.createValidation = [
  body("organizationName")
    .isString()
    .notEmpty()
    .withMessage("name is required"),
  body("primaryAddress")
    .isString()
    .notEmpty()
    .withMessage("primaryAddress is required"),
  body("addressLine1")
    .isString()
    .notEmpty()
    .withMessage("addressLine1 is string"),
  body("addressLine2").isString().withMessage("addressLine2 in string"),
  body("city").isString().notEmpty().withMessage("city in string"),
  body("state").isString().notEmpty().withMessage("state in string"),
  body("zipCode").isString().notEmpty().withMessage("zipCode in string"),
  body("country").isString().notEmpty().withMessage("country in string"),
  body("telePhone").isString().notEmpty().withMessage("telePhone in string"),
  body("email").isString().notEmpty().withMessage("email in string"),
  body("upload").isString().optional().withMessage("upload in string"),
  body("gstApplicable")
    .isString()
    .optional()
    .withMessage("gstApplicable in boolean"),
  body("gstNumber").isString().optional().withMessage("gstNumber in string"),
  body("companyType")
    .isString()
    .notEmpty()
    .withMessage("companyType in string"),

  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  },
];

exports.getOrgValidation = [
  param("id").optional().isMongoId().withMessage("valid id required"),

  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  },
];
exports.deleteOrgValidation = [
  param("id").isMongoId().withMessage("valid id required"),

  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  },
];

exports.updateOrgValidation = [
  body("organizationName")
    .isString()
    .optional()
    .withMessage("name is required"),
  body("primaryAddress")
    .isString()
    .optional()
    .withMessage("primaryAddress is required"),
  body("addressLine1")
    .isString()
    .optional()
    .withMessage("addressLine1 is string"),
  body("addressLine2").isString().withMessage("addressLine2 in string"),
  body("city").isString().optional().withMessage("city in string"),
  body("state").isString().optional().withMessage("state in string"),
  body("zipCode").isString().optional().withMessage("zipCode in string"),
  body("country").isString().optional().withMessage("country in string"),
  body("telePhone").isString().optional().withMessage("telePhone in string"),
  body("email").isString().optional().withMessage("email in string"),
  body("upload").isString().optional().withMessage("upload in string"),
  body("gstApplicable")
    .isString()
    .optional()
    .withMessage("gstApplicable in boolean"),
  body("gstNumber").isString().optional().withMessage("gstNumber in string"),
  body("companyType")
    .isString()
    .optional()
    .withMessage("companyType in string"),

  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  },
];
