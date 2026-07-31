const userModel = require("../models/user.model");
const sessionModel = require("../models/session.model");
const { hashPassword, comparePassword } = require("../utils/password");
const { generateTokens, verifyRefreshToken } = require("../utils/jwt");

const register = async (req, res) => {
  try {
    const { username, email, password, full_name } = req.body;

    const existingEmail = await userModel.findUserByEmail(email);
    if (existingEmail) {
      return res.status(400).json({
        success: false,
        message: "Email is already registered.",
      });
    }

    const existingUsername = await userModel.findUserByUsername(username);
    if (existingUsername) {
      return res.status(400).json({
        success: false,
        message: "Username is already taken.",
      });
    }

    const password_hash = await hashPassword(password);
    const user = await userModel.createUser({
      username,
      email,
      password_hash,
      full_name,
    });

    const tokens = generateTokens(user);

    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 7);

    await sessionModel.createSession({
      user_id: user.id,
      token: tokens.accessToken,
      refresh_token: tokens.refreshToken,
      expires_at: expiresAt,
    });

    res.status(201).json({
      success: true,
      message: "User registered successfully",
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        full_name: user.full_name,
        created_at: user.created_at,
      },
      tokens,
    });
  } catch (error) {
    console.error("Register error:", error);
    res.status(500).json({
      success: false,
      message: "An error occurred during registration.",
    });
  }
};

const login = async (req, res) => {
  try {
    const { login, password } = req.body;

    let user = await userModel.findUserByEmail(login);
    if (!user) {
      user = await userModel.findUserByUsername(login);
    }

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Invalid credentials.",
      });
    }

    if (!user.is_active) {
      return res.status(403).json({
        success: false,
        message: "Account is deactivated.",
      });
    }

    const isMatch = await comparePassword(password, user.password_hash);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: "Invalid credentials.",
      });
    }

    await userModel.updateLastLogin(user.id);

    const tokens = generateTokens(user);

    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 7);

    await sessionModel.createSession({
      user_id: user.id,
      token: tokens.accessToken,
      refresh_token: tokens.refreshToken,
      expires_at: expiresAt,
    });

    res.json({
      success: true,
      message: "Login successful",
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        full_name: user.full_name,
        last_login: user.last_login,
      },
      tokens,
    });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({
      success: false,
      message: "An error occurred during login.",
    });
  }
};

const refresh = async (req, res) => {
  try {
    const { refreshToken } = req.body;

    let decoded;
    try {
      decoded = verifyRefreshToken(refreshToken);
    } catch (err) {
      return res.status(401).json({
        success: false,
        message: "Invalid or expired refresh token.",
      });
    }

    const session = await sessionModel.findSessionByRefreshToken(refreshToken);
    if (!session || new Date(session.expires_at) < new Date()) {
      return res.status(401).json({
        success: false,
        message: "Session expired or revoked.",
      });
    }

    const user = await userModel.findUserById(decoded.id);
    if (!user || !user.is_active) {
      return res.status(401).json({
        success: false,
        message: "User not found or inactive.",
      });
    }

    const tokens = generateTokens(user);

    await sessionModel.revokeSessionByRefreshToken(refreshToken);

    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 7);

    await sessionModel.createSession({
      user_id: user.id,
      token: tokens.accessToken,
      refresh_token: tokens.refreshToken,
      expires_at: expiresAt,
    });

    res.json({
      success: true,
      message: "Token refreshed successfully",
      tokens,
    });
  } catch (error) {
    console.error("Refresh token error:", error);
    res.status(500).json({
      success: false,
      message: "An error occurred while refreshing token.",
    });
  }
};

const logout = async (req, res) => {
  try {
    const token = req.token;
    const { refreshToken } = req.body;

    if (token) {
      await sessionModel.revokeSessionByToken(token);
    }

    if (refreshToken) {
      await sessionModel.revokeSessionByRefreshToken(refreshToken);
    }

    res.json({
      success: true,
      message: "Logged out successfully",
    });
  } catch (error) {
    console.error("Logout error:", error);
    res.status(500).json({
      success: false,
      message: "An error occurred during logout.",
    });
  }
};

const getMe = async (req, res) => {
  try {
    res.json({
      success: true,
      user: req.user,
    });
  } catch (error) {
    console.error("GetMe error:", error);
    res.status(500).json({
      success: false,
      message: "An error occurred while fetching user profile.",
    });
  }
};

module.exports = {
  register,
  login,
  refresh,
  logout,
  getMe,
};
