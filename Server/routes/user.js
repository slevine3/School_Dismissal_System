const router = require("express").Router();
const db = require("../config");
const dayjs = require("dayjs");

const todayDate = dayjs().format("MM/DD/YYYY");

//CREATE NEW STUDENT DISMISSAL (SINGLE DATE)

router.post("/single", async (req, res) => {
  const date_start = req.body.formattedDate;
  const date_end = req.body.formattedDate;
  const time = req.body.formattedTime;
  const dismissal_method = req.body.dismissal_method;
  const reason = req.body?.reason;
  const students = req.body.selectedStudents;

  //FOR LOOP ITERATES FOR MULTIPLE STUDENTS (ADDING MORE THAN ONE DISMISSAL ENTRY)

  for (let i = 0; i < students.length; i++) {
    let student_id = students[i].student_id;

    try {
      const createSingleDismissal = await db("schedule")
        .select("*")
        .where("student_id", student_id)
        .insert({
          student_id: student_id,
          occurrence: "single",
          date_start: date_start,
          date_end: date_end,
          dismissal_timestamp: time,
          dismissal_method: dismissal_method,
          reason: reason,
        })
        .into("schedule");
    } catch (error) {
      console.log(error);
    }
  }
  res.status(200).json("Success!");
});

//CREATE NEW STUDENT DISMISSAL (DATE RANGE)

router.post("/range", async (req, res) => {
  const date_start = req.body.formattedDate;
  const date_end = req.body.formattedDate;
  const time = req.body.formattedTime;
  const dismissal_method = req.body.dismissal_method;
  const reason = req.body?.reason;
  const students = req.body.selectedStudents;

  console.log(req.body);
  //FOR LOOP ITERATES FOR MULTIPLE STUDENTS (ADDING MORE THAN ONE DISMISSAL ENTRY)

  for (let i = 0; i < students.length; i++) {
    let student_id = students[i].student_id;

    try {
      const createSingleDismissal = await db("schedule")
        .select("*")
        .where("student_id", student_id);
      // .insert({
      //   student_id: student_id,
      //   occurrence: "single",
      //   date_start: date_start,
      //   date_end: date_end,
      //   dismissal_timestamp: time,
      //   dismissal_method: dismissal_method,
      //   reason: reason,
      // })
      // .into("schedule");
    } catch (error) {
      console.log(error);
    }
  }
  res.status(200).json("Success!");
});

//DATA FOR LOGIN PAGE

router.post("/students", async (req, res) => {
  const user_id = req.body.user_id;
  console.log(user_id);
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

module.exports = router;
