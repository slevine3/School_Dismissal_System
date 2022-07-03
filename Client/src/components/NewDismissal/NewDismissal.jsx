import React, { useState } from "react";
import "./NewDismissal.css";
import { DatePicker, TimePicker, Checkbox, Input, Table } from "antd";
import dayjs from "dayjs";
import { useNavigate, useLocation } from "react-router-dom";
import { useForm, Controller } from "react-hook-form";
import { axiosInstance } from "../../requestMethods";
import { ArrowLeftOutlined } from "@ant-design/icons";
const { RangePicker } = DatePicker;

const NewDismissal = () => {
  const navigate = useNavigate();
  //USE LOCATION HOOK RETRIEVES STUDENT DATA FROM LOGIN PAGE
  const location = useLocation();
  const students = location.state?.students;
  const [error, setError] = useState(null);
  const [dateError, setDateError] = useState(null);
  let data = students && students.map((student) => student);

  //ADD KEY TO DATA ACCORDING TO STUDENT_ID
  for (let student in data) {
    if (!(Object.keys === "key")) {
      data[student]["key"] = data[student].student_id;
    }
  }

  //COLUMNS AND DATA FOR STUDENT TABLE
  const columns = [
    {
      title: "Full Name",

      render: (record) => (
        <React.Fragment>
          {record.first_name}
          <br />
          {record.last_name}
        </React.Fragment>
      ),
      responsive: ["xs"],
    },
    {
      title: "First Name",
      dataIndex: "first_name",
      responsive: ["sm"],
    },
    {
      title: "Last Name",
      dataIndex: "last_name",
      responsive: ["sm"],
    },
  ];
  console.log(data);

  const [selectionType, setSelectionType] = useState("checkbox");
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

  //REACT HOOK FORM
  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm();

  //VARIABLES FROM FORMS

  const [selectedStudents, setSelectedStudents] = useState(null);

  //VALUES FOR RECURRING DATES
  const weekdays = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];

  const handleFormSubmit = async (data, e) => {
    const beginningOfDay = dayjs().hour(0).minute(0).format();
    const dailyCutOffTime = dayjs().hour(12).minute(59).format();
    const endOfDay = dayjs().hour(23).minute(59).format();
    const dismissal_date_start = data.rangePicker[0];
    const date_start = Object.values(dismissal_date_start)[4];
    const formattedDate_start = dayjs(date_start).format();

    if (formattedDate_start < beginningOfDay) {
      setDateError("Please select a future date");
    } else if (!selectedStudents || selectedStudents.length === 0) {
      setError("Please select a student");
    } else if (
      formattedDate_start > dailyCutOffTime &&
      formattedDate_start < endOfDay
    ) {
      setDateError("Please select a future date. Daily cut off time is 1:00pm");
    } else {
      const dismissal_date_end = data.rangePicker[1];
      const dismissal_time = data.timePicker;
      const reason = data?.reason;
      const dismissal_method = data.dismissal_method;
      const checkbox = data?.checkbox;

      let date_end = Object.values(dismissal_date_end)[4];
      let formattedDate_end = dayjs(date_end).format("M-D-YYYY");

      let time = Object.values(dismissal_time)[4];
      let formattedTime = dayjs(time).format("HH:mm:ss");

      try {
        const response = await axiosInstance.post("/users/create", {
          selectedStudents,
          formattedDate_start,
          formattedDate_end,
          formattedTime,
          dismissal_method,
          reason,
          checkbox,
        });

        navigate("/home", { state: { students } });
      } catch (error) {
        console.log(error);
      }
    }
  };

  return (
    <div className="updateContainer">
      <div className="updateTitleContainer">
        <div className="updateArrowIcon">
          <ArrowLeftOutlined
            onClick={() => navigate("/home", { state: { students } })}
            style={{
              color: "white",
              fontSize: "40px",
            }}
          />
        </div>
        <div className="updateTitle">
          <h1
            style={{
              color: "white",
            }}
          >
            New Dismissal
          </h1>
        </div>
      </div>

      <form onSubmit={handleSubmit(handleFormSubmit)}>
        <div className="updateForm">
          <div className="updateStudentsSection">
            <Table
              style={{
                margin: "30px 0px",
              }}
              rowSelection={{
                type: selectionType,
                ...rowSelection,
              }}
              dataSource={data}
              columns={columns}
              pagination={{ pageSize: 8 }}
            />
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
                {error}
              </h3>
            </div>
          </div>

          <div className="updateValuesSection">
            <h3>Select a start and end date</h3>
            {<h3 style={{ color: "red" }}> {errors.rangePicker?.message}</h3>}
            {<h3 style={{ color: "red" }}> {dateError}</h3>}
            <Controller
              name="rangePicker"
              {...register("rangePicker", {
                required: "Date range is required",
              })}
              ref={null}
              control={control}
              render={({ field }) => (
                <RangePicker
                  {...field}
                  format="dddd, MMMM D, YYYY"
                  style={{
                    marginBottom: "30px",
                    width: "75%",
                  }}
                />
              )}
            />

            <h3>Select a dismissal time</h3>
            {<h3 style={{ color: "red" }}> {errors.timePicker?.message}</h3>}
            <Controller
              name="timePicker"
              control={control}
              {...register("timePicker", {
                required: "Dismissal time is required",
              })}
              ref={null}
              render={({ field }) => (
                <TimePicker
                  {...field}
                  showTime
                  size="large"
                  format="h:mm a"
                  style={{ marginBottom: "30px", width: "50%" }}
                />
              )}
            />

            <h3>Enter a dismissal method</h3>
            {
              <h3 style={{ color: "red" }}>
                {errors.dismissal_method?.message}
              </h3>
            }
            <Controller
              name="dismissal_method"
              control={control}
              {...register("dismissal_method", {
                required: "Dismissal method is required",
              })}
              ref={null}
              render={({ field }) => (
                <Input
                  {...field}
                  placeholder="Example: Parent Pickup"
                  maxLength={50}
                  style={{
                    marginBottom: "30px",
                    width: "50%",
                    textAlign: "center",
                  }}
                />
              )}
            />

            <h3>Enter a dismissal reason</h3>
            {<h3 style={{ color: "red" }}> {errors.reason?.message}</h3>}
            <Controller
              name="reason"
              control={control}
              {...register("reason", {
                required: "A reason is required",
              })}
              ref={null}
              render={({ field }) => (
                <Input
                  {...field}
                  placeholder="Max 50 characters"
                  maxLength={50}
                  style={{
                    marginBottom: "30px",
                    width: "50%",
                    textAlign: "center",
                  }}
                />
              )}
            />

            <h3 style={{ marginBottom: "30px" }}>
              Which day(s) of the week should this occur on?
            </h3>

            <div className="updateCheckboxContainer">
              <Controller
                name="checkbox"
                control={control}
                defaultValue={weekdays}
                render={({ field, value }) => (
                  <Checkbox.Group
                    {...field}
                    options={weekdays}
                    className="updateCheckbox"
                  />
                )}
              />
            </div>

            <Input
              type="submit"
              value="Submit Form"
              className="updateButton"
              style={{
                border: "2px solid black",
                width: "150px",
                backgroundColor: "#4B5F6D",
                color: "white",
                cursor: "pointer",
                marginTop: "20px",
              }}
            />
          </div>
        </div>
      </form>
    </div>
  );
};

export default NewDismissal;
