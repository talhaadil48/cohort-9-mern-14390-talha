require("dotenv").config();
const logger = require("./utils/logger");
const app = require("./app");
const { initDb } = require("./config/db");
const env = require("./config/env");

const PORT = Number(env.port) || 5000;

if (PORT < 0 || PORT > 65535) {
  throw new Error("Invalid PORT value");
}

const startServer = async () => {
  try {
    await initDb();
    app.listen(PORT, () => {
      logger.info(`Server running on port ${PORT}`);
    });
  } catch (error) {
    logger.error({ err: error }, "Failed to start server due to database initialization error");
    process.exit(1);
  }
};

startServer();
