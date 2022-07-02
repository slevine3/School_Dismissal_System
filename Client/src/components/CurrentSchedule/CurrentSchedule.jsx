import React, { useEffect } from "react";
import "./CurrentSchedule.css";
import dayjs from "dayjs";
import { Table, Button, Calendar, Typography, Input, Alert } from "antd";
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

  const [students, setStudents] = useState(location.state?.students);
  const [error, setError] = useState(false);
  const [warningError, setWarningError] = useState(false);

  const todayDate = dayjs().format("YYYY-MM-DD");

  //STUDENT TABLE TEXT SATURDAY AND SUNDAY -- SEE getSchedule() FOR const dayOfTheWeek
  let locale = {
    emptyText: "No School Today",
  };
  //RETRIEVES THE DAILY SCHEDULE ACCORDING TO USER SELECTION ON CALENDAR
  const getSchedule = async (value) => {
    let calendarDate = dayjs(value).format("YYYY-MM-DD");
    const dayOfTheWeek = dayjs(calendarDate).format("dddd");

    if (dayOfTheWeek === "Saturday" || dayOfTheWeek === "Sunday") {
      setStudents(null);
    } else {
      try {
        const response = await axiosInstance.get("/users/read", {
          params: { user_id, calendarDate },
        });
        setStudents(response.data.students);
      } catch (error) {
        console.log(error);
      }
    }
  };

  useEffect(() => {
    getSchedule();
  }, []);

  const columns = [
    {
      title: "All Student Details",

      render: (record) => (
        <React.Fragment>
          {record.first_name}
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
  let data = students && students.map((student) => student);

  // TABLE REQUIRES KEY FOR DATA
  let key = 0;
  for (let student in data) {
    if (!(Object.keys === "key")) {
      data[student]["key"] = key;
    }
    key++;
  }

  const [calendar, setCalendar] = useState(todayDate);
  const [selectedStudents, setSelectedStudents] = useState(null);
  const selectionType = null;
  //INCLUDED FROM ANTD - USED FOR SELECTING STUDENTS
  const rowSelection = {
    onChange: (selectedRowKeys, selectedRows) => {
      setSelectedStudents(selectedRows);
      if (selectedRowKeys.length > 0) {
        setError(false);
      }
    },
    getCheckboxProps: (record) => ({
      disabled: record.name === "Disabled User",
      // Column configuration not to be checked
      name: record.name,
    }),
  };
  const onPanelChange = (value) => {
    const calendarDate = dayjs(value).format("YYYY-MM-DD");
    getSchedule(value);
    setCalendar(calendarDate);
  };

  //DELETE USER SELECTION - ERROR HANDLING PREVENTS USER FROM DELETING A STANDARD SCHEDULE
  const handleDelete = async (value) => {
    if (!selectedStudents || selectedStudents.length === 0) {
      setWarningError("Please select a student schedule");
      setError(null);
    } else {
      try {
        const response = await axiosInstance.delete("/users/delete", {
          data: {
            selectedStudents,
            calendar,
          },
        });
        setStudents(response.data.students);

        if (response.status === 200) {
          window.location.reload();
        }
      } catch (error) {
        console.log(error);
        if (401) {
          setWarningError(null);
          setError(error.response.data.error);
        }
      }
    }
  };
  //NAVIGATE TO NEW DISMISSAL PAGE AND PASS STUDENT DATA
  const handleClick = () => {
    let students = location.state?.students;
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

            <Controller
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
            />
          </div>

          <div className="currentScheduleTable">
            <h1 className="currentTableTitle">Daily Dismissal Schedule</h1>
            <Controller
              name="students"
              control={control}
              render={({ onChange, value }) => (
                <Table
                  locale={locale}
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
        </div>
        <div className="currentScheduleButton">
          <Input
            type="submit"
            className="currentScheduleDeleteButton"
            value="Delete This Schedule"
            style={{
              border: "1px solid black",
              width: "200px",
              cursor: "pointer",
              marginRight: "10px",
            }}
          />

          <Button
            style={{
              border: "1px solid black",
              width: "200px",
              color: "black",
            }}
            onClick={handleClick}
          >
            Create New Dismissal
          </Button>
        </div>
        <div className="currentScheduleError">
          <h3
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              width: "300px",
              color: "red",
            }}
          >
            {warningError && (
              <Alert message={warningError} showIcon type="warning" />
            )}
            {error && <Alert message={error} showIcon type="error" />}
          </h3>
        </div>
      </form>
    </div>
  );
};

export default CurrentSchedule;
