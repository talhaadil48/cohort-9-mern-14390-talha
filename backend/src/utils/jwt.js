const jwt = require("jsonwebtoken");
const env = require("../config/env");

const generateTokens = (user) => {
  const payload = {
    id: user.id,
    username: user.username,
    email: user.email,
    type: "access",
  };

  const accessToken = jwt.sign(payload, env.jwt.secret, {
    expiresIn: env.jwt.expiresIn,
  });

  const refreshToken = jwt.sign(
    { id: user.id, type: "refresh" },
    env.jwt.refreshSecret,
    {
      expiresIn: env.jwt.refreshExpiresIn,
    }
  );

  return { accessToken, refreshToken };
};

const verifyAccessToken = (token) => {
  try {
    const decoded = jwt.verify(token, env.jwt.secret);
    if (decoded.type !== "access") {
      throw new Error("Invalid token type: expected access token");
    }
    return decoded;
  } catch (error) {
    throw error;
  }
};

const verifyRefreshToken = (token) => {
  try {
    const decoded = jwt.verify(token, env.jwt.refreshSecret);
    if (decoded.type !== "refresh") {
      throw new Error("Invalid token type: expected refresh token");
    }
    return decoded;
  } catch (error) {
    throw error;
  }
};

module.exports = {
  generateTokens,
  verifyAccessToken,
  verifyRefreshToken,
};
