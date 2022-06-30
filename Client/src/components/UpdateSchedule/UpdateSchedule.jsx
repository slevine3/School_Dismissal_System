import React, { useState } from "react";
import "./UpdateSchedule.css";
import { DatePicker, TimePicker, Checkbox, Input, Table, Switch } from "antd";
import dayjs from "dayjs";
import { useNavigate, useLocation } from "react-router-dom";
import { useForm, Controller } from "react-hook-form";
import { axiosInstance } from "../../requestMethods";

const { RangePicker } = DatePicker;

const UpdateSchedule = () => {
  const navigate = useNavigate();
  //USE LOCATION HOOK RETRIEVES STUDENT DATA FROM LOGIN PAGE
  const location = useLocation();
  const students = location.state?.students;
  const [error, setError] = useState();

  //COLUMNS AND DATA FOR STUDENT TABLE
  const columns = [
    {
      title: "First Name",
      dataIndex: "first_name",
    },
    {
      title: "Last Name",
      dataIndex: "last_name",
    },
  ];

  let data = students && students.map((student) => student);

  //ADD KEY TO DATA ACCORDING TO STUDENT_ID
  for (let student in data) {
    if (!(Object.keys === "key")) {
      data[student]["key"] = data[student].student_id;
    }
  }

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
  } = useForm({ defaultValues: { rangePicker: "" } });

  //VARIABLES FROM FORMS

  const [selectedStudents, setSelectedStudents] = useState(null);
  const [switchButton, setSwitchButton] = useState(false);
  console.log(selectedStudents);
  //VALUES FOR RECURRING DATES
  const weekdays = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];

  const handleFormSubmit = async (data, e) => {
    console.log("DATA: ", data);
    if (!selectedStudents || selectedStudents.length === 0) {
      setError("Please select a student");
    } else {
      const dismissal_date_start = data.rangePicker[0];
      const dismissal_date_end = data.rangePicker[1];
      const dismissal_time = data.timePicker;
      const reason = data?.reason;
      const dismissal_method = data.dismissal_method;
      const checkbox = data?.checkbox;

      let date_start = Object.values(dismissal_date_start)[4];
      let formattedDate_start = dayjs(date_start).format("M-D-YYYY");

      let date_end = Object.values(dismissal_date_end)[4];
      let formattedDate_end = dayjs(date_end).format("M-D-YYYY");

      let time = Object.values(dismissal_time)[4];
      let formattedTime = dayjs(time).format("HH:mm:ss");

      try {
        const response = await axiosInstance.post("/users/create", {
          selectedStudents, //****NOT PASSED WITH REACT HOOK FORM -- PASSED THROUGH USE STATE****
          formattedDate_start,
          formattedDate_end,
          formattedTime,
          dismissal_method,
          reason, //****NOT PASSED WITH REACT HOOK FORM -- PASSED THROUGH USE STATE****
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
      <div>
        <h1 className="updateTitle">New Dismissal</h1>
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
            <Controller
              name="rangePicker"
              {...register("rangePicker", {
                required: "Date range is required",
              })}
              control={control}
              render={({ field }) => (
                <RangePicker
                  {...field}
                  format="dddd, MMMM D, YYYY"
                  style={{
                    marginBottom: "30px",
                  }}
                />
              )}
            />

            {<h3 style={{ color: "red" }}> {errors.rangePicker?.message}</h3>}

            <h3>Select a dismissal time</h3>

            <Controller
              name="timePicker"
              control={control}
              {...register("timePicker", {
                required: "Dismissal time is required",
              })}
              render={({ field }) => (
                <TimePicker
                  {...field}
                  showTime
                  size="large"
                  format="h:mm a"
                  style={{ marginBottom: "30px", width: "250px" }}
                />
              )}
            />
            {<h3 style={{ color: "red" }}> {errors.timePicker?.message}</h3>}

            <h3>Enter a dismissal method</h3>

            <Controller
              name="dismissal_method"
              control={control}
              {...register("dismissal_method", {
                required: "Dismissal method is required",
              })}
              render={({ field }) => (
                <Input
                  {...field}
                  placeholder="Example: Parent Pickup"
                  maxLength={50}
                  style={{
                    marginBottom: "30px",
                    width: "250px",
                    textAlign: "center",
                  }}
                />
              )}
            />
            {
              <h3 style={{ color: "red" }}>
                {errors.dismissal_method?.message}
              </h3>
            }
            <h3>Enter a dismissal reason</h3>
            <Controller
              name="reason"
              control={control}
              {...register("reason", {
                required: "A reason is required",
              })}
              render={({ field }) => (
                <Input
                  {...field}
                  placeholder="Max 50 characters"
                  maxLength={50}
                  style={{
                    marginBottom: "30px",
                    width: "250px",
                    textAlign: "center",
                  }}
                />
              )}
            />
            {<h3 style={{ color: "red" }}> {errors.reason?.message}</h3>}
            <h3>Will this occur more than once?</h3>
            <div>
              <Switch
                onClick={(value) => setSwitchButton(value)}
                style={{ marginBottom: "30px" }}
              />
            </div>
            <div
              style={{
                display: "flex",
                flexDirection: "column",
              }}
            >
              <h3 style={{ marginBottom: "30px" }}>
                Which days of the week should this occur on?
              </h3>

              <Controller
                name="checkbox"
                control={control}
                defaultValue={switchButton ? weekdays : weekdays}
                render={({ field, value }) => (
                  <Checkbox.Group
                    {...field}
                    options={weekdays}
                    disabled={switchButton ? false : true}
                    style={{
                      marginBottom: "30px",
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                    }}
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
              }}
            />
          </div>
        </div>
      </form>
    </div>
  );
};

export default UpdateSchedule;
