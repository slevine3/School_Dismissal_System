const router = require("express").Router();
const db = require("../config");
const dayjs = require("dayjs");
const todayDate = dayjs().format();
const dayOfTheWeek = dayjs().format("dddd");

//GET ALL STUDENTS FOR ADMIN SCHEDULE

router.get("/", async (req, res) => {
  try {
    //RETRIEVE ALL STANDARD STUDENTS DISMISSALS
    const standardStudents = await db("students")
      .select("*")
      .innerJoin("schedule", "students.student_id", "schedule.student_id")
      .where("occurrence", "standard")
      .orderBy("last_name", "asc");
    //RETRIEVE ALL SINGLE OCCURRENCE DISMISSALS FOR TODAY
    let modifiedStudents = await db("students")
      .select("*")
      .innerJoin("schedule", "students.student_id", "schedule.student_id")
      .where("date_start", todayDate)
      .where("occurrence", "single")
      .orderBy("dismissal_timestamp", "asc");
    //RETRIEVE ALL DATE RANGE OCCURRENCE DISMISSALS FOR TODAY
    let modifiedStudentsDateRange = await db("students")
      .select("*")
      .innerJoin("schedule", "students.student_id", "schedule.student_id")
      .where("date_start", "<=", todayDate)
      .where("date_end", ">=", todayDate)
      .where("occurrence", "range")
      .orderBy("dismissal_timestamp", "asc");

    //RETRIEVE ALL RECURRING DATE OCCURRENCE DISMISSALS FOR TODAY
    let modifiedStudentsRecurringDates = await db("students")
      .select("*")
      .innerJoin("schedule", "students.student_id", "schedule.student_id")
      .where("date_start", "<=", todayDate)
      .where("date_end", ">=", todayDate)
      .whereILike("days_of_week", `%${dayOfTheWeek}%`)
      .where("occurrence", "Weekly")
      .orderBy("dismissal_timestamp", "asc");

    modifiedStudents = modifiedStudents.concat(
      modifiedStudentsDateRange,
      modifiedStudentsRecurringDates
    );
    // console.log(standardStudents);
    // console.log(modifiedStudents);
    //REMOVE STUDENTS WHO HAVE MODIFIED DISMISSALS FROM STANDARD STUDENTS

    standardStudents.forEach((item) => {
      for (let key in item) {
        if (key === "student_id") {
          modifiedStudents.forEach((elem, i) => {
            for (let id in elem) {
              if (id === "student_id" && item[key] === elem[id]) {
                // standardStudents.splice(i, 1);
//SPLICE NOT WORKING
                console.log(item[key], "=== ", elem[id]);
              }
            }
          });
        }
      }
    });

    res.status(200).json({ standardStudents, modifiedStudents });
  } catch (error) {
    console.log(error);
  }
});

module.exports = router;
