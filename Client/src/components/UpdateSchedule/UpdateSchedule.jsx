import React, { useEffect, useState } from "react";
import "./UpdateSchedule.css";
import { DatePicker, Radio, TimePicker, Checkbox } from "antd";
import dayjs from "dayjs";
const { RangePicker } = DatePicker;

const UpdateSchedule = () => {
  const [radio, setRadio] = useState("single");
  const [dateString, setDateString] = useState(null);
  const [timeString, setTimeString] = useState(null);
  const [singleDate, setSingleDate] = useState(true);
  const [dateRange, setDateRange] = useState(false);
  const [recurringDates, setRecurringDates] = useState(false);
  const [checkboxValues, setCheckboxValues] = useState(null);
  const [radioValue, setRadioValue] = useState("weekly");

  const handleClick = (e) => {
    let value = e.target.value;

    if (value === "single") {
      setSingleDate(true);
      setDateRange(false);
      setRecurringDates(false);
    } else if (value === "range") {
      setSingleDate(false);
      setDateRange(true);
      setRecurringDates(false);
    } else {
      setSingleDate(false);
      setDateRange(false);
      setRecurringDates(true);
    }
  };
  //DATE RANGE HANDLE CHANGE DATE RANGE
  const handleDateChange = (value, dateString) => {
    setDateString(dateString);
  };

  const handleTimeChange = (value, timeString) => {
    setTimeString(timeString);
  };

  let date = dateString + " " + timeString;
  // console.log("date: ", date);

  //NEED TO FORMAT MY DATE AND TIME LIKE THIS
  //2022-06-06T08:17:45.394+00:00

  const onChange = (date, dateString) => {
    setDateRange(dateString);
  };
  // console.log(dateRange);
  const onOk = (value) => {
    console.log("onOk: ", value);
  };

  //CHECKBOX HANDLE CHANGE AND VALUES FOR RECURRING DATE
  const handleCheckboxChange = (checkedValues) => {
    setCheckboxValues(checkedValues);
  };

  const weekdays = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];
  console.log(checkboxValues);

  //RADIO HANDLE CHANGE AND VALUES FOR RECURRING DATE
  const handleRadioChange = (e) => {
    setRadioValue(e.target.value);
  };
  console.log(radioValue);
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
        <div
          style={{
            display: singleDate ? "flex" : "none",
            flexDirection: "column",
            textAlign: "center",
          }}
        >
          <h3>Select a start date</h3>
          <DatePicker
            format="dddd, MMMM D, YYYY"
            onChange={handleDateChange}
            onOk={onOk}
            style={{
              width: "300px",
              marginBottom: "30px",
            }}
          />
          <h3>Select a time</h3>
          <TimePicker
            onChange={handleTimeChange}
            format="h:mm a"
            showTime
            size="large"
            style={{ marginBottom: "30px" }}
          />
        </div>
        {/* DATE RANGE PICKER */}
        <div
          style={{
            display: singleDate ? "none" : "flex",
            flexDirection: "column",
            textAlign: "center",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <h3>Select a start and end date</h3>
          <RangePicker
            format="dddd, MMMM D, YYYY"
            onChange={onChange}
            // onOk={onOk}
            style={{
              width: "500px",
              marginBottom: "30px",
            }}
          />
          <h3>Select a time</h3>
          <TimePicker
            onChange={handleTimeChange}
            format="h:mm a"
            showTime
            size="large"
            style={{
              marginBottom: "30px",
              width: "300px",
            }}
          />
        </div>
        <div
          style={{
            display: recurringDates ? "flex" : "none",
            flexDirection: "column",
            textAlign: "center",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          {/* RECURRING RANGE PICKER */}
          <h3 style={{ marginBottom: "30px" }}>
            Which days of the week should this occur on?
          </h3>
          <Checkbox.Group
            options={weekdays}
            onChange={handleCheckboxChange}
            style={{ marginBottom: "30px" }}
          />
          <h3 style={{ marginBottom: "30px" }}>How often should this occur?</h3>
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
  );
};

export default UpdateSchedule;
