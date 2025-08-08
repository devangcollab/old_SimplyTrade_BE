const { body, param, validationResult } = require("express-validator");
const mongoose = require("mongoose");

exports.createCategoryValidation = [
  body("categoryName")
    .isString()
    .notEmpty()
    .withMessage("Category name is required"),

  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  },
];

exports.updateCategoryValidation = [
  body("categoryName")
    .isString()
    .optional()
    .withMessage("Category name must be a string"),

  body("userId")
    .isMongoId()
    .optional()
    .withMessage("Valid user ID is required"),

  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  },
];

exports.categoryIdValidation = [
  param("id").isMongoId().withMessage("Valid category ID is required"),

  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  },
];
