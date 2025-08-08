const { body, check, validationResult, param } = require("express-validator");

exports.createRepairData = [
  body("organization")
    .isMongoId()
    .notEmpty()
    .withMessage("organization must be a valid MongoID and is required"),
  body("branch")
    .isMongoId()
    .notEmpty()
    .withMessage("organizationBranch must be a valid MongoID and is required"),
  body("customerName")
    .isMongoId()
    .notEmpty()
    .withMessage("customerName is required"),
  body("email").isEmail().notEmpty().withMessage("email is required"),

  check("device")
    .isArray({ min: 1 })
    .withMessage("device must be an array with at least one item"),
  check("device.*.modelName")
    .isMongoId()
    .notEmpty()
    .withMessage("modelName must be a valid MongoID and is required"),
  check("device.*.deviceName")
    .isMongoId()
    .notEmpty()
    .withMessage("deviceName must be a valid MongoID and is required"),
  check("device.*.amount")
    .isNumeric()
    .notEmpty()
    .withMessage("amount must be a number and is required"),
  check("device.*.estimatedCost")
    .isNumeric()
    .notEmpty()
    .withMessage("estimatedCost must be a number and is required"),
  check("device.*.status").isString().notEmpty().withMessage("Status Required"),
  check("device.*.date").isDate().notEmpty().withMessage("date is required"),

  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  },
];

exports.getRepairValidation = [
  param("id").optional().isMongoId().withMessage("valid id required"),

  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  },
];
exports.deleteRepairValidation = [
  param("id").isMongoId().withMessage("valid id required"),

  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  },
];

exports.updateRepairDataValidate = [
  body("organization")
    .isMongoId()
    .optional()
    .withMessage("organization must be a valid MongoID and is required"),
  body("branch")
    .isMongoId()
    .optional()
    .withMessage("organizationBranch must be a valid MongoID and is required"),
  body("customerName")
    .isMongoId()
    .optional()
    .withMessage("customerName is required"),
  body("email").isEmail().optional().withMessage("email is required"),

  body("modelName").isMongoId().optional().withMessage("model in string"),
  body("deviceName").isMongoId().optional().withMessage("device in string"),
  body("amount").isNumeric().optional().withMessage("Amount in Number"),
  body("estimatedCost")
    .isNumeric()
    .optional()
    .withMessage("Estimated Cost in Number"),
  body("status").isString().optional().withMessage("Status in String"),
  body("date").isDate().optional().withMessage("Date Required"),

  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  },
];
