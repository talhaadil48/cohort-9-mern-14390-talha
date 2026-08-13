const bcrypt = require("bcryptjs");
const logger = require("./logger");

const hashPassword = async (password) => {
  try {
    const salt = await bcrypt.genSalt(10);
    return await bcrypt.hash(password, salt);
  } catch (error) {
    logger.error({ err: error }, "Error hashing password");
    throw new Error("Password hashing failed");
  }
};

const comparePassword = async (password, hash) => {
  try {
    return await bcrypt.compare(password, hash);
  } catch (error) {
    logger.error({ err: error }, "Error comparing password");
    throw new Error("Password comparison failed");
  }
};

module.exports = {
  hashPassword,
  comparePassword,
};
