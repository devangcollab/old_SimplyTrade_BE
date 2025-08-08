const { body, param, validationResult } = require("express-validator");

const mongoose = require("mongoose");

exports.createCustomerValidation = [
  body("customerName")
    .isString()
    .notEmpty()
    .withMessage("Customer name is required"),

  body("organization")
    .isMongoId()
    .notEmpty()
    .withMessage("Valid orgId is required"),
  body("role").isString().notEmpty().withMessage("Valid role is required"),

  body("branchName")
    .isMongoId()
    .notEmpty()
    .withMessage("Valid orgBranchId is required"),

  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  },
];

exports.updateCustomerValidation = [
  body("customerName")
    .isString()
    .optional()
    .withMessage("Customer name is required"),

  body("organization")
    .isMongoId()
    .optional()
    .withMessage("Valid orgId is required"),

  body("branchName")
    .isMongoId()
    .optional()
    .withMessage("Valid orgBranchId is required"),
  body("role").isString().optional().withMessage("Valid role is required"),

  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  },
];

exports.customerIdValidation = [
  param("id").isMongoId().withMessage("Valid category ID is required"),

  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  },
];
