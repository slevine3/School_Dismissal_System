const express = require("express");
const app = express();
const dotenv = require("dotenv");
const cors = require("cors");

dotenv.config();
app.use(cors());
app.use(express.json());

//DATABASE CONNECTION AND ROUTES
const db = require("./config");

const scheduleRouter = require("./routes/schedule");
app.use("/api/schedule", scheduleRouter);


app.listen(process.env.PORT || 5000, () => {
  console.log("Server is running on port 5000");
});
