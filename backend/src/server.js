require("dotenv").config();

const app = require("./app");

const PORT = Number(process.env.PORT) || 5000;

if (PORT < 0 || PORT > 65535) {
  throw new Error("Invalid PORT value");
}
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});