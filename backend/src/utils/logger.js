const pino = require("pino");

let options = {
  level: process.env.LOG_LEVEL || "error",
};

if (process.env.NODE_ENV !== "production") {
  options.transport = {
    target: "pino-pretty",
    options: {
      colorize: true,
      translateTime: "SYS:standard",
      ignore: "pid,hostname",
    },
  };
}

const logger = pino(options);

module.exports = logger;    