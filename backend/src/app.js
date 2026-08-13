const express = require("express");
const cors = require("cors");
const authRoutes = require("./routes/auth.routes");
const noteRoutes = require("./routes/note.route");
const setupSwagger = require("./config/swagger");
const pinoHttp = require("pino-http");
const logger = require("./utils/logger");


const app = express();
app.use(
  pinoHttp({
    logger,

    customLogLevel: (_req, res) => {
      if (res.statusCode >= 500) {
        return "error";
      }
      if (res.statusCode >= 400) {
        return "warn";
      }
      return "silent";
    },

    customSuccessMessage: (req, res, responseTime) => {
      const message = res.locals?.body?.message;
      let logMessage = `${req.method} ${req.originalUrl} ${res.statusCode}`;
      if (message) {
        logMessage += ` - ${message}`;
      }
      return logMessage;
    },

    customErrorMessage: (req, res, err) => {
      const message = res.locals?.body?.message || err?.message;
      let logMessage = `${req.method} ${req.originalUrl} ${res.statusCode}`;
      if (message) {
        logMessage += ` - ${message}`;
      }
      return logMessage;
    },

    serializers: {
      req: () => undefined,
      res: () => undefined,
    },
  })
);


app.use((req, res, next) => {
    const originalJson = res.json.bind(res);
    res.json = (body) => {
        res.locals.body = body;
        return originalJson(body);
    };
    next();
});

app.use(cors());
app.use(express.json());

// Setup Swagger Docs
setupSwagger(app);

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/notes", noteRoutes);

app.get("/", (req, res) => {
    res.json({
        message: "Backend API running with PostgreSQL & JWT Auth",
        documentation: "/api/docs",
        status: "OK"
    });
});

module.exports = app;



