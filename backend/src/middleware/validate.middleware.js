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
    .isLength({ min: 6 })
    .withMessage("Password must be at least 6 characters long"),
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

module.exports = {
  registerValidation,
  loginValidation,
  refreshValidation,
};
