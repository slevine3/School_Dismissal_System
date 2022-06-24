const router = require("express").Router();
const db = require("../config");
 

router.get("/users", async (req, res) => {
  try {
    const users = await db("users").select("*");

    console.log(users);
  } catch (error) {
    console.log(error);
  }
});

module.exports = router;
