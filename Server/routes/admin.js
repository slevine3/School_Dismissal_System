const router = require("express").Router();
const db = require("../config");
const dayjs = require("dayjs");

const todayDate = dayjs().format("MM/DD/YYYY");
console.log(todayDate);

//GET ALL STUDENTS FOR ADMIN SCHEDULE

router.get("/", async (req, res) => {
  try {
    const standardStudents = await db("students")
      .select("*")
      .innerJoin("schedule", "students.student_id", "schedule.student_id")
      .where("occurrence", "standard")
      .orderBy("last_name", "asc");

    const modifiedStudents = await db("students")
      .select("*")
      .innerJoin("schedule", "students.student_id", "schedule.student_id")
      .where("date_start", todayDate)
      .orderBy("dismissal_timestamp", "asc");

    //REMOVE MODIFIED STUDENTS FROM STANDARD STUDENTS
    for (let i = 0; i < standardStudents.length; i++) {
      let standard_id = standardStudents[i].student_id;

      for (let j = 0; j < modifiedStudents.length; j++) {
        let modified_id = modifiedStudents[j].student_id;

        if (standard_id === modified_id) {
          standardStudents.splice(i, 1);
        }
      }
    }

    res.status(200).json({ standardStudents, modifiedStudents });
  } catch (error) {
    console.log(error);
  }
});

module.exports = router;
