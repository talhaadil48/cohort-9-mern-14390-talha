require("dotenv").config();

const jwtSecret = process.env.JWT_SECRET;
const jwtRefreshSecret = process.env.JWT_REFRESH_SECRET;

if (process.env.NODE_ENV !== "test") {
  if (!jwtSecret) {
    throw new Error("FATAL: JWT_SECRET environment variable is missing.");
  }
  if (!jwtRefreshSecret) {
    throw new Error("FATAL: JWT_REFRESH_SECRET environment variable is missing.");
  }
  if (jwtSecret === jwtRefreshSecret) {
    throw new Error("FATAL: JWT_SECRET and JWT_REFRESH_SECRET must be distinct keys.");
  }
}

module.exports = {
  port: process.env.PORT || 5000,
  databaseUrl: process.env.DATABASE_URL,
  dbSslRejectUnauthorized: process.env.DB_SSL_REJECT_UNAUTHORIZED !== "false",
  jwt: {
    secret: jwtSecret || "test_jwt_secret_must_be_set_in_env_file",
    refreshSecret: jwtRefreshSecret || "test_jwt_refresh_secret_must_be_set_in_env_file",
    expiresIn: process.env.JWT_EXPIRES_IN || "1h",
    refreshExpiresIn: process.env.JWT_REFRESH_EXPIRES_IN || "7d",
  },
};
