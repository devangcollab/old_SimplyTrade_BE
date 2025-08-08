const { body, param, validationResult } = require("express-validator");

const jwt = require("jsonwebtoken");

exports.createPaymentValidation = [
  body("organization")
    .isMongoId()
    .notEmpty()
    .withMessage("organization is required"),
  body("totalAmount")
    .isNumeric()
    .notEmpty()
    .withMessage("totalAmount is required"),
  body("paidToCustomer")
    .isNumeric()
    .notEmpty()
    .withMessage("paidToCustomer is string"),
  body("remainingAmount")
    .isNumeric()
    .notEmpty()
    .withMessage("remainingAmount in string"),
  body("account").isString().notEmpty().withMessage("account in string"),
  body("paymentAmount")
    .isNumeric()
    .notEmpty()
    .withMessage("paymentAmount in string"),

  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  },
];

exports.getPaymentValidation = [
  param("id").optional().isMongoId().withMessage("valid id required"),

  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  },
];
exports.deletePaymentValidation = [
  param("id").isMongoId().withMessage("valid id required"),

  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  },
];

exports.updatePaymentValidation = [
  body("organization")
    .isMongoId()
    .optional()
    .withMessage("organization is required"),
  body("totalAmount")
    .isNumeric()
    .optional()
    .withMessage("totalAmount is required"),
  body("paidToCustomer")
    .isNumeric()
    .optional()
    .withMessage("paidToCustomer is string"),
  body("remainingAmount")
    .isNumeric()
    .optional()
    .withMessage("remainingAmount in string"),
  body("account").isString().optional().withMessage("account in string"),
  body("paymentAmount")
    .isNumeric()
    .optional()
    .withMessage("paymentAmount in string"),

  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  },
];
