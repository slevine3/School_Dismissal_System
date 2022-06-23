const express = require("express");
const app = express();
const dotenv = require("dotenv");
const cors = require("cors");

dotenv.config();
app.use(cors());
app.use(express.json());

app.listen(process.env.PORT || 5000, () => {
   console.log("Server is running on port 5000");
  });
  