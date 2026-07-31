const db = require("../config/db");

const createUser = async ({ username, email, password_hash, full_name }) => {
  const result = await db.query(
    `INSERT INTO users (username, email, password_hash, full_name)
     VALUES ($1, $2, $3, $4)
     RETURNING id, username, email, full_name, is_active, created_at, updated_at`,
    [username, email, password_hash, full_name || null]
  );
  return result.rows[0];
};

const findUserByEmail = async (email) => {
  const result = await db.query(
    `SELECT * FROM users WHERE email = $1`,
    [email]
  );
  return result.rows[0];
};

const findUserByUsername = async (username) => {
  const result = await db.query(
    `SELECT * FROM users WHERE username = $1`,
    [username]
  );
  return result.rows[0];
};

const findUserById = async (id) => {
  const result = await db.query(
    `SELECT id, username, email, full_name, is_active, created_at, updated_at, last_login
     FROM users WHERE id = $1`,
    [id]
  );
  return result.rows[0];
};

const updateLastLogin = async (id) => {
  const result = await db.query(
    `UPDATE users SET last_login = CURRENT_TIMESTAMP WHERE id = $1 RETURNING id, last_login`,
    [id]
  );
  return result.rows[0];
};

module.exports = {
  createUser,
  findUserByEmail,
  findUserByUsername,
  findUserById,
  updateLastLogin,
};
