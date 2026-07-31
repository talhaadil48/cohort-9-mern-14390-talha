const db = require("../config/db");

const createSession = async ({ user_id, token, refresh_token, expires_at }) => {
  const result = await db.query(
    `INSERT INTO sessions (user_id, token, refresh_token, expires_at)
     VALUES ($1, $2, $3, $4)
     RETURNING id, user_id, token, refresh_token, expires_at, created_at, is_revoked`,
    [user_id, token, refresh_token, expires_at]
  );
  return result.rows[0];
};

const findSessionByRefreshToken = async (refresh_token) => {
  const result = await db.query(
    `SELECT * FROM sessions WHERE refresh_token = $1 AND is_revoked = FALSE`,
    [refresh_token]
  );
  return result.rows[0];
};

const findSessionByToken = async (token) => {
  const result = await db.query(
    `SELECT * FROM sessions WHERE token = $1 AND is_revoked = FALSE`,
    [token]
  );
  return result.rows[0];
};

const revokeSessionByRefreshToken = async (refresh_token) => {
  const result = await db.query(
    `UPDATE sessions SET is_revoked = TRUE WHERE refresh_token = $1 RETURNING id`,
    [refresh_token]
  );
  return result.rows[0];
};

const revokeSessionByToken = async (token) => {
  const result = await db.query(
    `UPDATE sessions SET is_revoked = TRUE WHERE token = $1 RETURNING id`,
    [token]
  );
  return result.rows[0];
};

const revokeAllUserSessions = async (user_id) => {
  await db.query(
    `UPDATE sessions SET is_revoked = TRUE WHERE user_id = $1`,
    [user_id]
  );
};

module.exports = {
  createSession,
  findSessionByRefreshToken,
  findSessionByToken,
  revokeSessionByRefreshToken,
  revokeSessionByToken,
  revokeAllUserSessions,
};
