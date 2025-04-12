const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const sequelize = require("./config/db");

const otpRoutes = require("./routes/otp");

const app = express();
const port = 3000;

app.use(bodyParser.json());
app.use(cors());
app.use("/api", otpRoutes);

sequelize.sync()
  .then(() => {
    console.log("MySQL DB connected and models synced.");
    app.listen(port, () => {
      console.log(`otpService is running on port ${port}`);
    });
  })
  .catch(err => {
    console.error("Failed to sync DB:", err);
  });

app.get("/", (req, res) => {
  res.json({ msg: "Service is running..." });
});
