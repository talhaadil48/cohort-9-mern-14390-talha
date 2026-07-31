const { verifyAccessToken } = require("../utils/jwt");
const userModel = require("../models/user.model");
const sessionModel = require("../models/session.model");

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
      decoded = verifyAccessToken(token);
    } catch (err) {
      return res.status(401).json({
        success: false,
        message: "Invalid or expired access token.",
      });
    }

    // Verify session is active and not revoked in database
    const session = await sessionModel.findSessionByToken(token);
    if (!session || session.is_revoked || new Date(session.expires_at) < new Date()) {
      return res.status(401).json({
        success: false,
        message: "Session has been revoked or expired. Please log in again.",
      });
    }

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
    console.error("Auth middleware error:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error during authentication.",
    });
  }
};

module.exports = {
  authenticateToken,
};
