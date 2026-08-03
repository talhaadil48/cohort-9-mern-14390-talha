const express = require("express");
const router = express.Router();
const authController = require("../controllers/auth.controller");
const { authenticateToken } = require("../middleware/auth.middleware");
const {
  registerValidation,
  loginValidation,
  refreshValidation,
} = require("../middleware/validate.middleware");

/**
 * @swagger
 * tags:
 *   name: Auth
 *   description: User registration, login, token refresh, and JWT-based authentication
 */

/**
 * @swagger
 * /api/auth/register:
 *   post:
 *     summary: Register a new user
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - username
 *               - email
 *               - password
 *             properties:
 *               username:
 *                 type: string
 *                 example: talha_dev
 *               email:
 *                 type: string
 *                 format: email
 *                 example: talha@example.com
 *               password:
 *                 type: string
 *                 format: password
 *                 example: Password123!
 *               full_name:
 *                 type: string
 *                 example: Talha Adil
 *     responses:
 *       201:
 *         description: User registered successfully
 *       400:
 *         description: Validation failed or User already exists
 *       500:
 *         description: Server error
 */
router.post("/register", registerValidation, authController.register);

/**
 * @swagger
 * /api/auth/login:
 *   post:
 *     summary: Login user with credentials
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - login
 *               - password
 *             properties:
 *               login:
 *                 type: string
 *                 description: Email address or username
 *                 example: talha@example.com
 *               password:
 *                 type: string
 *                 format: password
 *                 example: Password123!
 *     responses:
 *       200:
 *         description: Login successful, returns user info & JWT tokens
 *       401:
 *         description: Invalid credentials
 *       403:
 *         description: Account deactivated
 *       500:
 *         description: Server error
 */
router.post("/login", loginValidation, authController.login);

/**
 * @swagger
 * /api/auth/refresh:
 *   post:
 *     summary: Refresh access token using refresh token
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - refreshToken
 *             properties:
 *               refreshToken:
 *                 type: string
 *                 example: eyJhbGciOiJIUzI1Ni...
 *     responses:
 *       200:
 *         description: Token refreshed successfully
 *       401:
 *         description: Invalid, expired, or revoked refresh token
 *       500:
 *         description: Server error
 */
router.post("/refresh", refreshValidation, authController.refresh);

/**
 * @swagger
 * /api/auth/logout:
 *   post:
 *     summary: Logout user (stateless — client must discard tokens)
 *     description: |
 *       Since JWT is stateless, the server does not store sessions.
 *       Logout is achieved by the client discarding its access and refresh tokens.
 *       This endpoint exists as a standard REST endpoint to signal logout intent.
 *     tags: [Auth]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Logged out successfully
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Server error
 */
router.post("/logout", authenticateToken, authController.logout);

/**
 * @swagger
 * /api/auth/me:
 *   get:
 *     summary: Get current authenticated user profile
 *     tags: [Auth]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: User profile retrieved successfully
 *       401:
 *         description: Unauthorized, missing or invalid token
 *       500:
 *         description: Server error
 */
router.get("/me", authenticateToken, authController.getMe);

module.exports = router;
