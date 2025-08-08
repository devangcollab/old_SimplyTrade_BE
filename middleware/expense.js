const { body, param, validationResult } = require("express-validator");

const jwt = require("jsonwebtoken");

exports.createValidation = [
  body("organization")
    .isMongoId()
    .notEmpty()
    .withMessage("Organization is required"),
  body("branchName")
    .isMongoId()
    .notEmpty()
    .withMessage("branchName is required"),
  body("date").isDate().notEmpty().withMessage("date is required"),
  body("category").isString().notEmpty().withMessage("category is required"),
  body("modelName")
    .isMongoId()
    .optional()
    .withMessage("ModelName must be valid mongoDb Id"),
  body("deviceName")
    .isMongoId()
    .optional()
    .withMessage("deviceName must be valid mongoDb Id"),
  body("stock")
    .isMongoId()
    .optional()
    .withMessage("stock must be valid mongoDb Id"),
  body("amount").isNumeric().notEmpty().withMessage("Amount is required"),
  body("description")
    .isString()
    .notEmpty()
    .withMessage("description in string"),

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
  body("organization")
    .isMongoId()
    .optional()
    .withMessage("Organization is must be valid mongoDb Id"),
  body("branchName")
    .isMongoId()
    .optional()
    .withMessage("branchName must be valid mongoDb Id"),
  body("date").isDate().optional().withMessage("date is must be in date"),
  body("category").isString().optional().withMessage("category in String"),
  body("modelName")
    .isMongoId()
    .optional()
    .withMessage("ModelName must be valid mongoDb Id"),
  body("deviceName")
    .isMongoId()
    .optional()
    .withMessage("deviceName must be valid mongoDb Id"),
  body("stock")
    .isMongoId()
    .optional()
    .withMessage("stock must be valid mongoDb Id"),
  body("amount")
    .isNumeric()
    .optional()
    .withMessage("Amount is must be in number0"),
  body("description")
    .isString()
    .optional()
    .withMessage("description in string"),

  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  },
];
