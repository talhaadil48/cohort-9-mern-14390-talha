const { Pool } = require("pg");
const fs = require("fs");
const path = require("path");
const env = require("./env");
const logger = require("../utils/logger");

const pool = new Pool({
  connectionString: env.databaseUrl,
  ssl: env.databaseUrl
    ? { rejectUnauthorized: env.dbSslRejectUnauthorized }
    : false,
});

pool.on("error", (err) => {
  logger.error({ err }, "Unexpected error on idle PostgreSQL client");
});

const query = (text, params) => pool.query(text, params);

const initDb = async () => {
  try {
    const schemaPath = path.join(__dirname, "schema.sql");
    const schemaSql = fs.readFileSync(schemaPath, "utf8");
    await pool.query(schemaSql);
    logger.info("PostgreSQL Database schema initialized successfully.");
  } catch (error) {
    logger.error({ err: error }, "Failed to initialize PostgreSQL Database schema");
    throw error;
  }
};

module.exports = {
  pool,
  query,
  initDb,
};
