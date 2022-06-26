import React, { useState } from "react";
import "./UpdateSchedule.css";
import { DatePicker, Radio, TimePicker, Checkbox, Input, Table } from "antd";
import dayjs from "dayjs";
import { useLocation } from "react-router-dom";
import { useForm, Controller } from "react-hook-form";
import { axiosInstance } from "../../requestMethods";

const { RangePicker } = DatePicker;

const UpdateSchedule = () => {
  //USE LOCATION HOOK RETRIEVES STUDENT DATA FROM LOGIN PAGE
  const location = useLocation();
  const students = location.state?.students;

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
  const [selectionType, setSelectionType] = useState("checkbox");

  //REACT HOOK FORM
  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm();

  //VARIABLES FROM FORMS

  const [singleDate, setSingleDate] = useState(true);
  // const [dateRange, setDateRange] = useState(false);
  const [recurringDates, setRecurringDates] = useState(false);
  const [checkboxValues, setCheckboxValues] = useState(null);
  const [radioValue, setRadioValue] = useState("weekly");
  const [selectedStudents, setSelectedStudents] = useState(null);

  //HANDLECLICK USED TO SWITCH BETWEEN FORMS (CHANGES DISPLAY FLEX/NONE)
  const handleClick = (e) => {
    let value = e.target.value;

    if (value === "single") {
      setSingleDate(true);
      // setDateRange(false);
      setRecurringDates(false);
    } else if (value === "range") {
      setSingleDate(false);
      // setDateRange(true);
      setRecurringDates(false);
    } else {
      setSingleDate(false);
      // setDateRange(false);
      setRecurringDates(true);
    }
  };
  //DATE RANGE
  const onChange = (date, dateString) => {
    // setDateRange(dateString);
    console.log('date:', date)
    console.log('dateString: ', dateString)
  };

  const onOk = (value) => {
    console.log("onOk: ", value);
  };

  //CHECKBOX HANDLECHANGE AND VALUES (M/T/W/Th/F) FOR RECURRING DATE
  const handleCheckboxChange = (checkedValues) => {
    setCheckboxValues(checkedValues);
  };

  const weekdays = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];

  //RADIO BUTTONS HANDLECHANGE AND VALUES (weekly/monthly) FOR RECURRING DATE
  const handleRadioChange = (e) => {
    setRadioValue(e.target.value);
  };
  //SINGLE DATE FORM SUBMIT
  const handleSingleSubmit = (data, e) => {
    const dismissal_date = data.datePicker;
    const dismissal_time = data.timePicker;
    const reason = data?.reason;
    const dismissal_method = data.dismissal_method;

    let date = Object.values(dismissal_date)[4];
    let formattedDate = dayjs(date).format("M-D-YYYY");

    let time = Object.values(dismissal_time)[4];
    let formattedTime = dayjs(time).format("HH:mm:ss");

    try {
      const response = axiosInstance.post("/user/single", {
        formattedDate,
        formattedTime,
        reason,
        dismissal_method,
        selectedStudents,
      });
    } catch (error) {
      console.log(error);
    }
  };
  //DATE RANGE FORM SUBMIT
  const handleDateRangeSubmit = (data, e) => {
    const dismissal_date_start = data.datePicker;
    const dismissal_date_end = data.datePicker;
    const dismissal_time = data.timePicker;
    const reason = data?.reason;
    const dismissal_method = data.dismissal_method;

    let date_start = Object.values(dismissal_date_start)[4];
    let formattedDate_start = dayjs(date_start).format("M-D-YYYY");

    let date_end = Object.values(dismissal_date_start)[4];
    let formattedDate_end = dayjs(date_end).format("M-D-YYYY");

    let time = Object.values(dismissal_time)[4];
    let formattedTime = dayjs(time).format("HH:mm:ss");

    try {
      const response = axiosInstance.post("/user/range", {
        formattedDate_start,
        formattedDate_end,
        formattedTime,
        reason,
        dismissal_method,
        selectedStudents,
      });
      console.log(response.data);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="updateContainer">
      <h1 className="updateTitle">New Dismissal</h1>
      <div className="updateContainerList">
        <Radio.Group
          style={{ marginBottom: "50px" }}
          defaultValue="single"
          size="large"
        >
          <Radio.Button onClick={(e) => handleClick(e)} value="single">
            Single Date
          </Radio.Button>
          <Radio.Button onClick={(e) => handleClick(e)} value="range">
            Date Range
          </Radio.Button>
          <Radio.Button onClick={(e) => handleClick(e)} value="recurring">
            Recurring Dates
          </Radio.Button>
        </Radio.Group>

        {/* SINGLE DATE PICKER */}
        <form onSubmit={handleSubmit(handleSingleSubmit)}>
          <div
            className="updateSingleForm"
            style={{
              display: singleDate ? "flex" : "none",
              textAlign: "center",
            }}
          >
            <div
              className="updateTable"
              style={{
                display: singleDate ? "flex" : "none",
                flexDirection: "column",
                textAlign: "center",
              }}
            >
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
                    value={rowSelection}
                    columns={columns}
                    dataSource={data}
                  />
                )}
              />
            </div>
            <div
              className="updateSingleFormProperties"
              style={{
                display: singleDate ? "flex" : "none",
                flexDirection: "column",
                textAlign: "center",
              }}
            >
              <h3>Select a start date</h3>
              {/* <h3 style={{ color: "#ff0000" }}>{errors.datePicker?.message}</h3> */}
              <Controller
                name="datePicker"
                control={control}
                render={({ field }) => (
                  <DatePicker
                    {...field}
                    format="dddd, MMMM D, YYYY"
                    style={{
                      marginBottom: "30px",
                    }}
                    // {...register("datePicker", {
                    //   required: "*Please select a date",
                    // })}
                  />
                )}
              />

              <h3>Select a dismissal time</h3>
              <h3 style={{ color: "#ff0000" }}>
                {errors?.timePicker?.message}
              </h3>
              <Controller
                name="timePicker"
                control={control}
                render={({ field }) => (
                  <TimePicker
                    {...field}
                    showTime
                    size="large"
                    format="h:mm a"
                    style={{ marginBottom: "30px" }}
                    // {...register("timePicker", {
                    //   required: "*Please select a time",
                    // })}
                  />
                )}
              />

              <h3>Input dismissal method</h3>
              {/* <h3 style={{ color: "#ff0000" }}>
                {errors?.dismissal_method?.message}
              </h3> */}
              <Controller
                name="dismissal_method"
                control={control}
                render={({ field }) => (
                  <Input
                    {...field}
                    placeholder="Example: Parent Pickup"
                    maxLength={50}
                    style={{ marginBottom: "30px" }}
                    // {...register("dismissal_method", {
                    //   required: "*Dismissal method is required",
                    // })}
                  />
                )}
              />

              <h3>Input reason for dismissal</h3>
              {/* <h3 style={{ color: "#ff0000" }}>{errors?.reason?.message}</h3> */}
              <Controller
                name="reason"
                control={control}
                render={({ field }) => (
                  <Input
                    {...field}
                    placeholder="Max 50 characters"
                    maxLength={50}
                    style={{ marginBottom: "30px" }}
                    // {...register("reason", {
                    //   required: "*A reason is required",
                    // })}
                  />
                )}
              />

              <Input type="submit" value="Submit Form" />
            </div>
          </div>
        </form>

        {/* DATE RANGE PICKER */}
        <form onSubmit={handleSubmit(handleDateRangeSubmit)}>
          <div
            className="updateSingleForm"
            style={{
              display: singleDate ? "none" : "flex",

              textAlign: "center",
            }}
          >
            <div
              className="updateTable"
              style={{
                display: singleDate ? "none" : "flex",

                textAlign: "center",
              }}
            >
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
                    value={rowSelection}
                    columns={columns}
                    dataSource={data}
                  />
                )}
              />
            </div>
            <div
              className="updateSingleFormProperties"
              style={{
                display: singleDate ? "none" : "flex",
                flexDirection: "column",
                textAlign: "center",
              }}
            >
              <h3>Select a start and end date</h3>
              <h3 style={{ color: "#ff0000" }}>{errors.datePicker?.message}</h3>
              <Controller
                name="datePicker"
                control={control}
                render={({ field }) => (
                  <RangePicker
                    {...field}
            
                    size="large"
                    format="dddd, MMMM D, YYYY"
                    style={{ marginBottom: "3 0px", width: "500px" }}
                    // {...register("timePicker", {
                    //   required: "*Please select a time",
                    // })}
                  />
                )}
              />

              <h3>Select a dismissal time</h3>
              {/* <h3 style={{ color: "#ff0000" }}>
                {errors?.timePicker?.message}
              </h3> */}
              <Controller
                name="timePicker"
                control={control}
                render={({ field }) => (
                  <TimePicker
                    {...field}
                    showTime
                    size="large"
                    format="h:mm a"
                    style={{ marginBottom: "30px" }}
                    // {...register("timePicker", {
                    //   required: "*Please select a time",
                    // })}
                  />
                )}
              />
             

              <h3>Input dismissal method</h3>
              <h3 style={{ color: "#ff0000" }}>
                {errors?.dismissal_method?.message}
              </h3>
              <Controller
                name="dismissal_method"
                control={control}
                render={({ field }) => (
                  <Input
                    {...field}
                    placeholder="Example: Parent Pickup"
                    maxLength={50}
                    style={{ marginBottom: "30px" }}
                    // {...register("dismissal_method", {
                    //   required: "*Dismissal method is required",
                    // })}
                  />
                )}
              />

              <h3>Input reason for dismissal</h3>
              {/* <h3 style={{ color: "#ff0000" }}>{errors?.reason?.message}</h3> */}
              <Controller
                name="reason"
                control={control}
                render={({ field }) => (
                  <Input
                    {...field}
                    placeholder="Max 50 characters"
                    maxLength={50}
                    style={{ marginBottom: "30px" }}
                    {...register("reason", {
                      required: "*A reason is required",
                    })}
                  />
                )}
              />

              <Input type="submit" value="Submit Form" />
              <div
                style={{
                  display: recurringDates ? "flex" : "none",
                  flexDirection: "column",
                  textAlign: "center",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <h3 style={{ marginBottom: "30px" }}>
                  Which days of the week should this occur on?
                </h3>
                <Checkbox.Group
                  options={weekdays}
                  onChange={handleCheckboxChange}
                  style={{ marginBottom: "30px" }}
                />
                <h3 style={{ marginBottom: "30px" }}>
                  How often should this occur?
                </h3>
                <Radio.Group
                  onChange={handleRadioChange}
                  defaultValue="weekly"
                  size="small"
                  style={{ marginBottom: "30px" }}
                >
                  <Radio value="weekly">Weekly</Radio>
                  <Radio value="monthly">Monthly</Radio>
                </Radio.Group>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UpdateSchedule;
