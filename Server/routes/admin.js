const router = require("express").Router();
const db = require("../config");
const dayjs = require("dayjs");

const todayDate = dayjs().format("MM/DD/YYYY");

router.get("/", async (req, res) => {


  try {
    const standardStudents = await db("students")
      .select("*")
      .innerJoin("schedule", "students.student_id", "schedule.student_id")
      .whereNot("date_start", todayDate)
      .where("occurrence", "standard")
      .orderBy("last_name", "asc")
    

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

module.exports = router;
