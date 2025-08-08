const { body, param, validationResult } = require("express-validator");

// Create Color Validation
exports.validateCreateColorData = [
  body("colorName")
    .isString()
    .notEmpty()
    .withMessage("Color name must be a non-empty string"),
  body("deviceId")
    .isMongoId()
    .withMessage("Device ID must be a valid MongoDB ObjectId"),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  },
];

// Get Color by ID Validation
exports.validateGetOneColorData = [
  param("id").isMongoId().withMessage("Valid Color ID required"),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  },
];

// Delete Color Validation
exports.validateDeleteColorData = [
  param("id").isMongoId().withMessage("Valid Color ID required"),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  },
];

// Update Color Validation
exports.validateUpdateColorData = [
  param("id").isMongoId().withMessage("Valid Color ID required"),
  body("colorName")
    .optional()
    .isString()
    .withMessage("Color name must be a string"),
  body("deviceId")
    .optional()
    .isMongoId()
    .withMessage("Device ID must be a valid MongoDB ObjectId"),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  },
];
