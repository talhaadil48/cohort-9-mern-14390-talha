const express = require("express");
const cors = require("cors");
const authRoutes = require("./routes/auth.routes");

const app = express();

app.use(cors());
app.use(express.json());

// Routes
app.use("/api/auth", authRoutes);

app.get("/", (req, res) => {
    res.json({
        message: "Backend API running with PostgreSQL & JWT Auth",
        status: "OK"
    });
});

module.exports = app;