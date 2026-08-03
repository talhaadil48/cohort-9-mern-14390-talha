const express = require("express");
const cors = require("cors");
const authRoutes = require("./routes/auth.routes");
const setupSwagger = require("./config/swagger");

const app = express();

app.use(cors());
app.use(express.json());

// Setup Swagger Docs
setupSwagger(app);

// Routes
app.use("/api/auth", authRoutes);

app.get("/", (req, res) => {
    res.json({
        message: "Backend API running with PostgreSQL & JWT Auth",
        documentation: "/api/docs",
        status: "OK"
    });
});

module.exports = app;