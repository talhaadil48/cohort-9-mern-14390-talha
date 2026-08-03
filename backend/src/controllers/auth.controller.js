const userModel = require("../models/user.model");
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

    let user;
    try {
      user = await userModel.createUser({
        username,
        email,
        password_hash,
        full_name,
      });
    } catch (dbErr) {
      // Handle Postgres unique constraint violation (23505) in race conditions
      if (dbErr.code === "23505") {
        return res.status(400).json({
          success: false,
          message: "Username or email is already in use.",
        });
      }
      throw dbErr;
    }

    const tokens = generateTokens(user);

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
    const loginNormalized = login.trim();

    let user = await userModel.findUserByEmail(loginNormalized);
    if (!user) {
      user = await userModel.findUserByUsername(loginNormalized);
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

    const user = await userModel.findUserById(decoded.id);
    if (!user || !user.is_active) {
      return res.status(401).json({
        success: false,
        message: "User not found or inactive.",
      });
    }

    const tokens = generateTokens(user);

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
    // Stateless JWT: logout is handled client-side by discarding the tokens.
    // No server-side session to revoke.
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
