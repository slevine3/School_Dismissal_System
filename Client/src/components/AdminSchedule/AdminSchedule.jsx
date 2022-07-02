import React from "react";
import "./AdminSchedule.css";
import dayjs from "dayjs";
import { Table } from "antd";
import { useState } from "react";
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
  const todayDate = date.format("dddd, MMMM D, YYYY ");

  const [students, setStudents] = useState(null);

  const columns = [
    {
      title: "All Student Details",

      render: (record) => (
        <React.Fragment>
          {record.first_name}
          <br />
          {record.last_name}
          <br />
          {record.dismissal_timestamp}

          <br />
          {record.dismissal_method}
          <br />
          {record.reason}
        </React.Fragment>
      ),
      responsive: ["xs"],
    },
    {
      title: "First Name",
      dataIndex: "first_name",
      sorter: (a, b) => a.first_name.localeCompare(b.first_name),
      responsive: ["sm"],
    },
    {
      title: "Last Name",
      dataIndex: "last_name",
      sorter: (a, b) => a.last_name.localeCompare(b.last_name),
      responsive: ["sm"],
    },
    {
      title: "Time",
      dataIndex: "dismissal_timestamp",
      sorter: (a, b) =>
        a.dismissal_timestamp.localeCompare(b.dismissal_timestamp),
        responsive: ["sm"],
    },
    {
      title: "Method",
      dataIndex: "dismissal_method",
      responsive: ["sm"],
    },
    {
      title: "Reason",
      dataIndex: "reason",
      responsive: ["sm"],
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
        <h1 style={{ color: "white" }}>Admin Dismissal Schedule</h1>
      </div>
      <div className="adminScheduleDates">
        <h2 style={{ color: "white" }}> {todayDate}</h2>
      </div>
      <div className="adminTable">
        <Table columns={columns} dataSource={data} />
      </div>
    </div>
  );
};

export default AdminSchedule;
