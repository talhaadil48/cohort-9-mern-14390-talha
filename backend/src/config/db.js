const { Pool } = require("pg");
const fs = require("fs");
const path = require("path");
const env = require("./env");

const pool = new Pool({
  connectionString: env.databaseUrl,
  ssl: env.databaseUrl
    ? { rejectUnauthorized: env.dbSslRejectUnauthorized }
    : false,
});

pool.on("error", (err) => {
  console.error("Unexpected error on idle PostgreSQL client", err);
});

const query = (text, params) => pool.query(text, params);

const initDb = async () => {
  try {
    const schemaPath = path.join(__dirname, "schema.sql");
    const schemaSql = fs.readFileSync(schemaPath, "utf8");
    await pool.query(schemaSql);
    console.log("PostgreSQL Database schema initialized successfully.");
  } catch (error) {
    console.error("Failed to initialize PostgreSQL Database schema:", error.message);
    throw error;
  }
};

module.exports = {
  pool,
  query,
  initDb,
};
