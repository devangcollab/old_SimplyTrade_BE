const { body, param, validationResult } = require("express-validator");
const mongoose = require("mongoose");

// Middleware for creating a capacity validation
exports.createCapacityValidation = [
  body("capacityName")
    .isString()
    .notEmpty()
    .withMessage("Capacity name is required"),

  body("deviceId")
    .isMongoId()
    .notEmpty()
    .withMessage("Valid device ID is required"),

  // Handle errors
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  },
];

// Middleware for updating a capacity validation
exports.updateCapacityValidation = [
  body("capacityName")
    .isString()
    .optional()
    .withMessage("Capacity name must be a string"),

  body("deviceId")
    .isMongoId()
    .optional()
    .withMessage("Valid device ID is required"),

  // Handle errors
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  },
];

// Middleware for validating capacity ID (for get, delete, etc.)
exports.capacityIdValidation = [
  param("id")
    .isMongoId()
    .withMessage("Valid capacity ID is required"),

  // Handle errors
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  },
];
