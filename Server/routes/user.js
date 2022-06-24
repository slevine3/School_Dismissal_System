const router = require("express").Router();
const db = require("../config");
const dayjs = require("dayjs");

const todayDate = dayjs().format("MM/DD/YYYY");


//GET STUDENT SCHEDULE

router.get("/", async (req, res) => {
  const user_id = req.body
  console.log(user_id);
  try {
    const standardStudents = await db("users")
      .select("*")
      // .innerJoin("schedule", "students.student_id", "schedule.student_id")
      // .whereNot("date_start", todayDate)
      // .where("occurrence", "standard")
      // .where("user_id", user_id)
      // .orderBy("first_name", "asc");

    const modifiedStudents = await db("students")
      .select("*")
      .innerJoin("schedule", "students.student_id", "schedule.student_id")
      .where("date_start", todayDate)
      .orderBy("last_name", "asc");

    res.status(200).json({ standardStudents, modifiedStudents });
  } catch (error) {
    console.log(error);
  }
});


//CREATE STUDENT SCHEDULE

router.post("/", async (req, res) => {
  const user_id = req.body
  console.log(user_id);
  try {
    const createSchedule = await db("users")
      .select("*")
      // .innerJoin("schedule", "students.student_id", "schedule.student_id")
      // .whereNot("date_start", todayDate)
      // .where("occurrence", "standard")
      // .where("user_id", user_id)
      // .orderBy("first_name", "asc");

    res.status(200).json({ standardStudents, modifiedStudents });
  } catch (error) {
    console.log(error);
  }
});



module.exports = router;
