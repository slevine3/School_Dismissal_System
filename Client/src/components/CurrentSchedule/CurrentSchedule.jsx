import React, { useEffect } from "react";
import "./CurrentSchedule.css";
import dayjs from "dayjs";
import { Divider, Table, Button, Calendar, Typography } from "antd";
import { useForm, Controller } from "react-hook-form";
import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { axiosInstance } from "../../requestMethods";
import axios from "axios";

const CurrentSchedule = () => {
  const navigate = useNavigate();
  //USE LOCATION HOOK RETRIEVES STUDENT DATA FROM LOGIN PAGE
  const location = useLocation();

  const user_id = location.state.students[0].parental_id;
  const [selectionType, setSelectionType] = useState("checkbox");
  const [students, setStudents] = useState(location.state?.students);

  const todayDate = dayjs().format("YYYY-MM-DD");

  const getSchedule = async (value) => {
    let calendarDate = dayjs(value).format("YYYY-MM-DD");
    console.log(calendarDate);
    try {
      const response = await axios.get("http://localhost:5000/api/users/read", {
        params: { user_id, calendarDate },
      });
      setStudents(response.data.students);
      console.log(response.data);
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    getSchedule();
  }, []);

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
  let data = students && students.map((student) => student);
  let counter = Number.MAX_SAFE_INTEGER;

  //ADD KEY TO DATA ACCORDING TO STUDENT_ID
  for (let student in data) {
    if (!(Object.keys === "key")) {
      data[student]["key"] = data[student].student_id;
    }
  }

  while (data?.length < 3) {
    let key = { key: counter, name: "Disabled User" };
    data.push(key);
    counter--;
  }

  const [selectedStudents, setSelectedStudents] = useState(null);
  //INCLUDED FROM ANTD - USED FOR SELECTING STUDENTS
  const rowSelection = {
    onChange: (selectedRowKeys, selectedRows) => {
      setSelectedStudents(selectedRows);
    },
    getCheckboxProps: (record) => ({
      disabled: record.name === "Disabled User",
      // Column configuration not to be checked
      name: record.name,
    }),
  };
  const onPanelChange = (value) => {
    getSchedule(value);
  };
  //REACT HOOK FORM
  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm();

  const handleFormSubmit = (data) => {
    console.log(data);
  };
  const handleCalendarClick = (value) => {
    console.log(value);
  };
  const handleDelete = () => {};
  const handleClick = () => {
    navigate("/update", { state: { students } });
  };
  return (
    <div className="currentScheduleContainer">
      <form onSubmit={handleSubmit(handleFormSubmit)}>
        <div className="currentScheduleForm">
          <div className="currentScheduleTable">
            <Controller
              name="students"
              control={control}
              render={({ field }) => (
                <Table
                  {...field}
                  style={{
                    margin: "30px 0px",
                  }}
                  rowSelection={{
                    type: selectionType,
                    ...rowSelection,
                  }}
                  pagination={{ pageSize: 3 }}
                  value={rowSelection}
                  columns={columns}
                  dataSource={data}
                />
              )}
            />
          </div>
          <div className="currentScheduleCalendar">
            <Typography.Title level={5} style={{ textAlign: "center" }}>
              Select a date to view the daily schedule
            </Typography.Title>
            <Calendar fullscreen={false} onChange={onPanelChange} />

            {/* <Controller
              name="calendar"
              control={control}
              onChange={(e) => console.log(e)}
              render={({ field }) => (
                <Calendar
                  format="dddd, MMMM D, YYYY"
                  fullscreen={false}
                  style={{
                    marginBottom: "30px",
                  }}
                />
              )}
            /> */}
          </div>
        </div>
      </form>
      <div className="currentScheduleButton">
        <Button
          style={{ marginBottom: "20px", border: "1px solid black" }}
          onClick={handleDelete}
        >
          Delete This Schedule
        </Button>
        <Button style={{ border: "1px solid black" }} onClick={handleClick}>
          Create New Dismissal
        </Button>
      </div>
    </div>
  );
};

export default CurrentSchedule;
