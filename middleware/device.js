const { body, param, validationResult } = require('express-validator');

// Create Device Validation
exports.validateCreateDeviceData = [
    body('deviceName')
        .isString()
        .notEmpty()
        .withMessage("Device name must be a non-empty string"),
    body('modelId')
        .isMongoId()
        .withMessage("Model ID must be a valid MongoDB ObjectId"),
    (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        next();
    }
];

// Get Device by ID Validation
exports.validateGetOneDeviceData = [
    param('id')
        .isMongoId()
        .withMessage("Valid Device ID required"),
    (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        next();
    }
];

// Delete Device Validation
exports.validateDeleteDeviceData = [
    param('id')
        .isMongoId()
        .withMessage("Valid Device ID required"),
    (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        next();
    }
];

// Update Device Validation
exports.validateUpdateDeviceData = [
    param('id')
        .isMongoId()
        .withMessage("Valid Device ID required"),
    body('deviceName')
        .optional()
        .isString()
        .withMessage("Device name must be a string"),
    body('modelId')
        .optional()
        .isMongoId()
        .withMessage("Model ID must be a valid MongoDB ObjectId"),
    (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        next();
    }
];
