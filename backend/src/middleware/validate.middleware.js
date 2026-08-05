const { body, validationResult } = require("express-validator");

const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      message: "Validation failed",
      errors: errors.array(),
    });
  }
  next();
};

const registerValidation = [
  body("username")
    .trim()
    .notEmpty()
    .withMessage("Username is required")
    .isLength({ min: 3, max: 50 })
    .withMessage("Username must be between 3 and 50 characters")
    .matches(/^[a-zA-Z0-9_]+$/)
    .withMessage("Username can only contain letters, numbers, and underscores"),
  body("email")
    .trim()
    .notEmpty()
    .withMessage("Email is required")
    .isEmail()
    .withMessage("Please provide a valid email address")
    .normalizeEmail(),
  body("password")
    .notEmpty()
    .withMessage("Password is required")
    .isLength({ min: 8, max: 72 })
    .withMessage("Password must be between 8 and 72 characters long"),
  body("full_name")
    .optional()
    .trim()
    .isLength({ max: 100 })
    .withMessage("Full name cannot exceed 100 characters"),
  handleValidationErrors,
];

const loginValidation = [
  body("login")
    .trim()
    .notEmpty()
    .withMessage("Email or Username is required"),
  body("password")
    .notEmpty()
    .withMessage("Password is required"),
  handleValidationErrors,
];

const refreshValidation = [
  body("refreshToken")
    .notEmpty()
    .withMessage("Refresh token is required"),
  handleValidationErrors,
];

const noteValidation = [
  body("title")
    .trim()
    .notEmpty()
    .withMessage("Title is required")
    .isLength({ max: 255 })
    .withMessage("Title cannot exceed 255 characters"),
  body("content")
    .optional()
    .trim()
    .isLength({ max: 1000 })
    .withMessage("Content cannot exceed 1000 characters"),
  body("content_rich")
    .optional()
    .trim(),
  body("color")
    .optional()
    .trim()
    .isLength({ max: 7 })
    .withMessage("Color cannot exceed 7 characters"),
  handleValidationErrors,
];

const noteUpdateValidation = [  
  body("title")
    .optional()
    .trim()
    .isLength({ max: 255 })
    .withMessage("Title cannot exceed 255 characters"),
  body("content")
    .optional()
    .trim()
    .isLength({ max: 1000 })
    .withMessage("Content cannot exceed 1000 characters"),
  body("content_rich")
    .optional()
    .trim(),
  body("color")
    .optional()
    .trim()
    .isLength({ max: 7 })
    .withMessage("Color cannot exceed 7 characters"),
  handleValidationErrors,
];

const archiveStatusValidation = [
  body("is_archived")
    .notEmpty()
    .withMessage("is_archived field is required")
    .isBoolean()
    .withMessage("is_archived must be a boolean value"),
  handleValidationErrors,
];

const pinnedStatusValidation = [
  body("is_pinned")
    .notEmpty()
    .withMessage("is_pinned field is required")
    .isBoolean()
    .withMessage("is_pinned must be a boolean value"),
  handleValidationErrors,
];


module.exports = {
  registerValidation,
  loginValidation,
  refreshValidation,
  pinnedStatusValidation,
  archiveStatusValidation,  
  noteValidation,
  noteUpdateValidation,
};
