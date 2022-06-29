import React from "react";
import "./AdminSchedule.css";
import dayjs from "dayjs";
import { Divider, Table, DatePicker, Button } from "antd";
import { ArrowLeftOutlined, ArrowRightOutlined } from "@ant-design/icons";
import { useState } from "react";
import { StarOutlined, StarFilled, StarTwoTone } from "@ant-design/icons";
import { getTwoToneColor, setTwoToneColor } from "@ant-design/icons";
import { Link } from "react-router-dom";
import { useEffect } from "react";
import { axiosInstance } from "../../requestMethods";


const AdminSchedule = () => {
  useEffect(() => {
    const getSchedule = async () => {
      try {
        const response = await axiosInstance.get("/admin/");

        setStudents(response.data.students);
      } catch (error) {
        console.log(error);
      }
    };
    getSchedule();
  }, []);
  //TODAY'S DATE
  const date = new dayjs();

  const [selectionType, setSelectionType] = useState("checkbox");
  const [quarterValue, setQuarterValue] = useState(null);
  const [students, setStudents] = useState(null);

  const [todayDate, setTodayDate] = useState(
    date.format("dddd, MMMM D, YYYY ")
  );

  // HANDLE DATE CHANGE CONNECTED TO THE DATEPICKER
  const handleDateChange = (date, dateString) => {
    setQuarterValue(dateString);
  };

  //RETRIEVE DATA FOR PREVIOUS WEEK
  const handlePreviousWeek = () => {};
  //RETRIEVE DATA FOR NEXT WEEK
  const handleNextWeek = () => {};

  const columns = [
    {
      title: "First Name",
      dataIndex: "first_name",
    },
    {
      title: "Last Name",
      dataIndex: "last_name",
    },
    {
      title: "Time",
      dataIndex: "dismissal_timestamp",
    },
    {
      title: "Method",
      dataIndex: "dismissal_method",
    },
    {
      title: "Reason",
      dataIndex: "reason",
    },
  ];

  const data = students && students.map((student) => student);

  //ADD KEY TO STANDARD DATA ACCORDING TO STUDENT_ID
  for (let student in data) {
    if (!(Object.keys === "key")) {
      data[student]["key"] = data[student].student_id;
    }
  }

  return (
    <div className="adminScheduleContainer">
      <div className="adminScheduleTitle">
        <h1>Admin Dismissal Schedule</h1>
      </div>
      <div className="adminScheduleDates">
        <h2> {todayDate}</h2>
      </div>

      <Divider />
      <Table columns={columns} dataSource={data} />
    </div>
  );
};

export default AdminSchedule;
