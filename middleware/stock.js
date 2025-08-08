const { body, param, check, validationResult } = require("express-validator");

const jwt = require("jsonwebtoken");

exports.createValidation = [
  // Validate organization
  body("organization")
    .isMongoId()
    .notEmpty()
    .withMessage("organization must be a valid MongoID and is required"),

  // Validate branch
  body("branch")
    .isMongoId()
    .notEmpty()
    .withMessage("branch must be a valid MongoID and is required"),

  // Validate customerName
  body("customerName")
    .isMongoId()
    .notEmpty()
    .withMessage("customerName is required"),

  // Validate device array
  check("device")
    .isArray({ min: 1 })
    .withMessage("device must be an array with at least one item"),

  // Validate each device object
  check("device.*.categoryName")
    .isMongoId()
    .notEmpty()
    .withMessage("categoryName must be a valid MongoID and is required"),
  check("device.*.modelName")
    .isMongoId()
    .notEmpty()
    .withMessage("modelName must be a valid MongoID and is required"),
  check("device.*.deviceName")
    .isMongoId()
    .notEmpty()
    .withMessage("deviceName must be a valid MongoID and is required"),
  check("device.*.capacityName")
    .isMongoId()
    .notEmpty()
    .withMessage("capacityName must be a valid MongoID and is required"),
  check("device.*.color")
    .isMongoId()
    .notEmpty()
    .withMessage("color must be a valid MongoID if provided"),

  // Validate imei array inside each device object
  check("device.*.imei")
    .isArray({ min: 1 })
    .withMessage("imei must be an array with at least one item"),
  check("device.*.imei.*.imeiNo")
    .optional()
    .isString()
    .withMessage("imeiNo is required and must be a string"),
  check("device.*.imei.*.srNo")
    .optional()
    .isString()
    .withMessage("srNo is required and must be a string"),
  check("device.*.imei.*.totalAmount")
    .isNumeric()
    .notEmpty()
    .withMessage("totalAmount must be a number and is required"),
  check("device.*.imei.*.paidToCustomer")
    .isNumeric()
    .notEmpty()
    .withMessage("paidToCustomer must be a number and is required"),
  check("device.*.imei.*.remainingAmount")
    .optional()
    .isNumeric()
    .withMessage("remainingAmount must be a number and is required"),

  // body("upload").isString().notEmpty().withMessage("upload is required"),

  check("payment")
    .isArray({ min: 1 })
    .withMessage("payment must be an array with at least one item"),

  // Validate each payment object
  check("payment.*.paymentAccount")
    .isMongoId()
    .notEmpty()
    .withMessage("paymentAccount must be a valid MongoID and is required"),

  check("payment.*.paymentAmount")
    .isNumeric()
    .notEmpty()
    .withMessage("paymentAmount must be a number and is required"),

  // Middleware to handle validation errors
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  },
];

exports.getStockValidation = [
  param("id").optional().isMongoId().withMessage("valid id required"),

  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  },
];
exports.deleteStockValidation = [
  param("id").isMongoId().withMessage("valid id required"),

  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  },
];

exports.updateStockValidation = [
  body("organization")
    .isString()
    .optional()
    .withMessage("organization is required"),
  body("branch").isString().optional().withMessage("branch is required"),
  body("customerName")
    .isMongoId()
    .optional()
    .withMessage("customer is required"),
  // body("customerName")
  //   .isString()
  //   .optional()
  //   .withMessage("customerName is string"),
  // body("customerPhone")
  //   .isString()
  //   .optional()
  //   .withMessage("customerPhone in string"),
  body("categoryName").isMongoId().optional().withMessage("category in string"),
  body("modelName").isMongoId().optional().withMessage("model in string"),
  body("deviceName").isMongoId().optional().withMessage("device in string"),
  body("capacityName").isMongoId().optional().withMessage("capacity in string"),
  body("color").isMongoId().optional().withMessage("color in string"),
  body("imeiNo").isString().optional().withMessage("imeiNo in string"),
  body("srNo").isString().optional().withMessage("srNo in string"),
  body("totalAmount")
    .isNumeric()
    .optional()
    .withMessage("totalAmount in number"),
  body("paidToCustomer")
    .isNumeric()
    .optional()
    .withMessage("paidToCustomer in string"),
  body("remainingAmount")
    .isNumeric()
    .optional()
    .withMessage("remainingAmount in string"),
  // body("upload").isString().optional().withMessage("upload in string"),

  check("payment.*.paymentAccount")
    .isMongoId()
    .optional()
    .withMessage("paymentAccount must be a valid MongoID"),

  check("payment.*.paymentAmount")
    .isNumeric()
    .optional()
    .withMessage("paymentAmount must be a number "),

  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  },
];
