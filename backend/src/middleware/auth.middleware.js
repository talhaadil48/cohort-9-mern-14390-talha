const jwtUtils = require("../utils/jwt");
const userModel = require("../models/user.model");
const logger = require("../utils/logger");

const authenticateToken = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({
        success: false,
        message: "Authentication required. Bearer token missing.",
      });
    }

    const token = authHeader.split(" ")[1];
    let decoded;
    try {
      decoded = jwtUtils.verifyAccessToken(token);
    } catch (err) {
      return res.status(401).json({
        success: false,
        message: "Invalid or expired access token.",
      });
    }

    // JWT signature is valid — check user still exists and is active
    const user = await userModel.findUserById(decoded.id);
    if (!user || !user.is_active) {
      return res.status(401).json({
        success: false,
        message: "User account not found or deactivated.",
      });
    }

    req.user = user;
    req.token = token;
    next();
  } catch (error) {
    logger.error({ err: error }, "Auth middleware error");
    return res.status(500).json({
      success: false,
      message: "Internal server error during authentication.",
    });
  }
};

module.exports = {
  authenticateToken,
};
