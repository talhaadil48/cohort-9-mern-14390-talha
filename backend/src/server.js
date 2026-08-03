require("dotenv").config();

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
      console.log(`Server running on port ${PORT}`);
    });
  } catch (error) {
    console.error("Failed to start server due to database initialization error:", error);
    process.exit(1);
  }
};

startServer();