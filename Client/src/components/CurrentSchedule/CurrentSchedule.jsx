import React, { useEffect } from "react";
import "./CurrentSchedule.css";
import dayjs from "dayjs";
import { Divider, Table, Button, Calendar, Typography, Input } from "antd";
import { useForm, Controller } from "react-hook-form";
import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { axiosInstance } from "../../requestMethods";

const CurrentSchedule = () => {
  const navigate = useNavigate();
  //USE LOCATION HOOK RETRIEVES STUDENT DATA FROM LOGIN PAGE
  const location = useLocation();
  //REACT HOOK FORM
  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm();

  const user_id = location.state.students[0].parental_id;
  const [selectionType, setSelectionType] = useState("checkbox");
  const [students, setStudents] = useState(location.state?.students);

  const todayDate = dayjs().format("YYYY-MM-DD");

  const getSchedule = async (value) => {
    let calendarDate = dayjs(value).format("YYYY-MM-DD");

    try {
      const response = await axiosInstance.get("/users/read", {
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

  const handleDelete = async (value) => {
    console.log("VALUE: ", value);
    // try {
    //   const response = await axios.delete(
    //     "http://localhost:5000/api/users/delete",
    //   );
    //   setStudents(response.data.students);
    //   console.log(response.data);
    // } catch (error) {
    //   console.log(error);
    // }
  };
  const handleClick = () => {
    navigate("/update", { state: { students } });
  };
  return (
    <div className="currentScheduleContainer">
      <form onSubmit={handleSubmit(handleDelete)}>
        <div className="currentScheduleForm">
          <div className="currentScheduleCalendar">
            <Typography.Title
              level={5}
              style={{ textAlign: "center", marginTop: "5px" }}
            >
              Select a date to view daily schedule
            </Typography.Title>
            <Calendar fullscreen={false} onChange={onPanelChange} />

            {/* <Controller
              name="calendar"
              control={control}
              render={({ onChange, render, ref }) => (
                <Calendar
                  onChange={onPanelChange}
                  format="dddd, MMMM D, YYYY"
                  fullscreen={false}
                  style={{
                    marginBottom: "30px",
                  }}
                  inputRef={ref}
                />
              )}
            /> */}
          </div>

          <div className="currentScheduleTable">
            <h1 className="currentTableTitle">Daily Dismissal Schedule</h1>
            <Controller
              name="students"
              control={control}
              render={({ onChange, value }) => (
                <Table
                  value={value}
                  onChange={onChange}
                  style={{
                    margin: "30px 0px",
                  }}
                  rowSelection={{
                    type: selectionType,
                    ...rowSelection,
                  }}
                  pagination={{ pageSize: 3 }}
                  // value={rowSelection}
                  columns={columns}
                  dataSource={data}
                />
              )}
            />

            <h4 style={{ color: "red" }}>{errors.students?.message}</h4>
          </div>
        </div>
        <div className="currentScheduleButton">
          <div></div>
          <div></div>
          <div></div>
          <Input
            type="submit"
            className="currentScheduleDeleteButton"
            title="You must first select a student"
            value="Delete This Schedule"
            style={{
              border: "1px solid black",
              width: "200px",
              cursor: "pointer",
              marginRight: "10px",
            }}
          />

          <Button
            style={{ border: "1px solid black", width: "200px" }}
            onClick={handleClick}
          >
            Create New Dismissal
          </Button>
        </div>
      </form>
    </div>
  );
};

export default CurrentSchedule;
