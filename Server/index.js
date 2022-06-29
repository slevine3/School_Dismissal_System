const express = require("express");
const app = express();
const dotenv = require("dotenv");
const cors = require("cors");

dotenv.config();
app.use(cors());
app.use(express.json());

//DATABASE CONNECTION AND ROUTES
const db = require("./config");

const adminRouter = require("./routes/admin");
const usersRouter = require("./routes/users");

app.use("/api/admin", adminRouter);
app.use("/api/users", usersRouter);

app.listen(process.env.PORT || 5000, () => {
  console.log("Server is running on port 5000");
});
