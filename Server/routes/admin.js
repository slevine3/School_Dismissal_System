const router = require("express").Router();
const db = require("../config");
const dayjs = require("dayjs");
const todayDate = dayjs().format();
const dayOfTheWeek = dayjs().format("dddd");

//GET ALL STUDENTS FOR ADMIN SCHEDULE

router.get("/", async (req, res) => {
  try {
    //RETRIEVE ALL STANDARD STUDENTS DISMISSALS
    let standardStudents = await db("users")
      .select("*")
      .innerJoin("students", "students.parental_id", "users.user_id")
      .innerJoin("schedule", "students.student_id", "schedule.student_id")
      .where("occurrence", "standard")
      .orderBy("dismissal_timestamp", "asc");
    //RETRIEVE ALL RECURRING DATE OCCURRENCE DISMISSALS FOR TODAY
    let modifiedStudents = await db("users")
      .select("*")
      .innerJoin("students", "students.parental_id", "users.user_id")
      .innerJoin("schedule", "students.student_id", "schedule.student_id")
      .where("date_start", "<=", todayDate)
      .where("date_end", ">=", todayDate)
      .whereILike("occurrence", `%${dayOfTheWeek}%`)
      .orderBy("dismissal_timestamp", "asc");

    //REMOVE STUDENTS FROM STANDARD STUDENTS IF THEY EXIST IN MODIFIED STUDENTS

    let modifiedStudentIdArray = modifiedStudents.map(
      (student) => student.student_id
    );

    let filteredStudents = standardStudents.filter(
      (student) => !modifiedStudentIdArray.includes(student.student_id)
    );
    let students = modifiedStudents.concat(filteredStudents);


    res.status(200).json({ students });
  } catch (error) {
    console.log(error);
  }
});

module.exports = router;
