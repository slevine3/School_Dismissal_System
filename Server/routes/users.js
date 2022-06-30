const router = require("express").Router();
const db = require("../config");
const dayjs = require("dayjs");

const todayDate = dayjs().format("MM/DD/YYYY");

//RETRIEVE DATA (STUDENTS) - LOGIN PAGE

router.get("/students", async (req, res) => {
  const user_id = req.query.user_id;

  try {
    const students = await db("users")
      .select("*")
      .innerJoin("students", "students.parental_id", "users.user_id")
      .where("user_id", user_id)
      .orderBy("first_name", "asc");

    const isAdmin = await db("users").select("*").where("user_id", user_id);

    res.status(200).json({ students, isAdmin });
  } catch (error) {
    console.log(error);
  }
});

//SUBMIT FORM DATA TO DATABASE - NEW DISMISSAL PAGE

router.post("/create", async (req, res) => {
  const students = req.body.selectedStudents;
  const date_start = req.body.formattedDate_start;
  const date_end = req.body.formattedDate_end;
  const time = req.body.formattedTime;
  const dismissal_method = req.body.dismissal_method;
  const reason = req.body?.reason;
  const checkbox = req.body?.checkbox;
  //FOR LOOP ITERATES FOR MULTIPLE STUDENTS (ADDING ONE ENTRY TO DATABASE ON EACH LOOP)

  for (let i = 0; i < students.length; i++) {
    let student_id = students[i].student_id;

    try {
      const createSingleDismissal = await db("schedule")
        .select("*")
        .where("student_id", student_id)
        .insert({
          student_id: student_id,
          date_start: date_start,
          date_end: date_end,
          dismissal_timestamp: time,
          dismissal_method: dismissal_method,
          reason: reason,
          occurrence: checkbox,
        })
        .into("schedule");
      res.status(200).json({ response: "Success!" });
    } catch (error) {
      console.log(error);
    }
  }
});
//RETRIEVE USER DATA FROM DATABASE - HOME PAGE

router.get("/read", async (req, res) => {
  const user_id = req.query.user_id;
  const calendarDate = req.query.calendarDate;
  const dayOfTheWeek = dayjs(calendarDate).format("dddd");

  try {
    let modifiedStudents = await db("users")
      .select("*")
      .innerJoin("students", "students.parental_id", "users.user_id")
      .innerJoin("schedule", "students.student_id", "schedule.student_id")
      .where("user_id", user_id)
      .where("date_start", "<=", calendarDate)
      .where("date_end", ">=", calendarDate)
      .whereILike("occurrence", `%${dayOfTheWeek}%`)
      .orderBy("dismissal_timestamp", "asc");

    let standardStudents = await db("users")
      .select("*")
      .innerJoin("students", "students.parental_id", "users.user_id")
      .innerJoin("schedule", "students.student_id", "schedule.student_id")
      .where("user_id", user_id)
      .where("occurrence", "standard")
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

//DELETE STUDENT SCHEDULE - HOME PAGE

router.delete("/delete", async (req, res) => {
  const students = req.body.selectedStudents;
  const calendarDate = req.body.calendar;
  const dayOfTheWeek = dayjs(calendarDate).format("dddd");
  try {
    //CHECK IF ANY OF THE STUDENTS BEING DELETED IS A STANDARD DISMISSAL
    let oneOrMoreStudentsContainStandardDismissal = students.some(
      (student) => student.reason === null
    );

    if (oneOrMoreStudentsContainStandardDismissal) {
      throw "One or more of the student schedules you selected are standard dismissals and cannot be deleted!";
    }
    //FOR LOOP ITERATES FOR MULTIPLE STUDENTS (DELETING ONE ENTRY FROM DATABASE ON EACH LOOP)
    for (let i = 0; i < students.length; i++) {
      let student_id = students[i].student_id;
      let reason = students[i].reason;

      const deleteStudentSchedule = await db("schedule")
        .select("*")
        .where("student_id", student_id)
        .where("reason", reason)
        .where("date_start", "<=", calendarDate)
        .where("date_end", ">=", calendarDate)
        .whereILike("occurrence", `%${dayOfTheWeek}%`)
        .del();
    }
    res.status(200).json({});
  } catch (error) {
    res.status(401).json({ error });
  }
});

module.exports = router;
