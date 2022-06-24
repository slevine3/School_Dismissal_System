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
const userRouter = require("./routes/user");

app.use("/api/admin", adminRouter);
app.use("/api/user", userRouter);

app.listen(process.env.PORT || 5000, () => {
  console.log("Server is running on port 5000");
});
