const { body, param, validationResult } = require('express-validator');

// Create Model Validation
exports.validateCreateModelData = [
    body('modelName')
        .isString()
        .notEmpty()
        .withMessage("Model name must be a non-empty string"),
    body('categoryId')
        .isMongoId()
        .withMessage("Category ID must be a valid MongoDB ObjectId"),
    (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        next();
    }
];

// Get Model by ID Validation
exports.validateGetOneModelData = [
    param('id')
        .isMongoId()
        .withMessage("Valid Model ID required"),
    (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        next();
    }
];

// Delete Model Validation
exports.validateDeleteModelData = [
    param('id')
        .isMongoId()
        .withMessage("Valid Model ID required"),
    (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        next();
    }
];

// Update Model Validation
exports.validateUpdateModelData = [
    param('id')
        .isMongoId()
        .withMessage("Valid Model ID required"),
    body('modelName')
        .optional()
        .isString()
        .withMessage("Model name must be a string"),
    body('categoryId')
        .optional()
        .isMongoId()
        .withMessage("Category ID must be a valid MongoDB ObjectId"),
    (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        next();
    }
];
