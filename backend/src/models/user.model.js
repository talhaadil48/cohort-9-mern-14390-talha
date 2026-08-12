const db = require("../config/db");
const logger = require("../utils/logger");

const createUser = async ({ username, email, password_hash, full_name }) => {
  try {
    const result = await db.query(
      `INSERT INTO users (username, email, password_hash, full_name)
       VALUES ($1, $2, $3, $4)
       RETURNING id, username, email, full_name, is_active, created_at, updated_at`,
      [username, email.toLowerCase(), password_hash, full_name || null]
    );
    return result.rows[0];
  } catch (error) {
    logger.error({ err: error }, "Error in createUser");
    throw error;
  }
};

const findUserByEmail = async (email) => {
  try {
    const result = await db.query(
      `SELECT * FROM users WHERE LOWER(email) = LOWER($1)`,
      [email]
    );
    return result.rows[0];
  } catch (error) {
    logger.error({ err: error }, "Error in findUserByEmail");
    throw error;
  }
};

const findUserByUsername = async (username) => {
  try {
    const result = await db.query(
      `SELECT * FROM users WHERE username = $1`,
      [username]
    );
    return result.rows[0];
  } catch (error) {
    logger.error({ err: error }, "Error in findUserByUsername");
    throw error;
  }
};

const findUserById = async (id) => {
  try {
    const result = await db.query(
      `SELECT id, username, email, full_name, is_active, created_at, updated_at, last_login
       FROM users WHERE id = $1`,
      [id]
    );
    return result.rows[0];
  } catch (error) {
    logger.error({ err: error }, "Error in findUserById");
    throw error;
  }
};

const updateLastLogin = async (id) => {
  try {
    const result = await db.query(
      `UPDATE users SET last_login = CURRENT_TIMESTAMP WHERE id = $1 RETURNING id, last_login`,
      [id]
    );
    return result.rows[0];
  } catch (error) {
    logger.error({ err: error }, "Error in updateLastLogin");
    throw error;
  }
};

module.exports = {
  createUser,
  findUserByEmail,
  findUserByUsername,
  findUserById,
  updateLastLogin,
};
