import React from "react";
import "./AdminSchedule.css";
import dayjs from "dayjs";
import { Divider, Table, DatePicker, Button } from "antd";
import { ArrowLeftOutlined, ArrowRightOutlined } from "@ant-design/icons";
import { useState } from "react";
import { StarOutlined, StarFilled, StarTwoTone } from "@ant-design/icons";
import { getTwoToneColor, setTwoToneColor } from "@ant-design/icons";
import { Link } from "react-router-dom";
const columns = [
  {
    title: "Name",
    dataIndex: "name",
    render: (text) => <a>{text}</a>,
  },
  {
    title: "Monday (6/20)",
    dataIndex: "time",
  },
  {
    title: "Tuesday (6/21)",
    dataIndex: "time",
  },
  {
    title: "Wednesday (6/22)",
    dataIndex: "time",
  },
  {
    title: "Thursday (6/23)",
    dataIndex: "time",
  },
  {
    title: "Friday (6/24)",
    dataIndex: "time",
  },
];
const data = [
  {
    key: "1",
    name: "John Brown",
    time: "3:00pm",
  },
  {
    key: "2",
    name: "Jim Green",
    time: "3:00pm",
  },
  {
    key: "3",
    name: "Joe Black",
    time: "3:00pm",
  },
]; // rowSelection object indicates the need for row selection

const rowSelection = {
  onChange: (selectedRowKeys, selectedRows) => {
    console.log(
      `selectedRowKeys: ${selectedRowKeys}`,
      "selectedRows: ",
      selectedRows
    );
  },
  getCheckboxProps: (record) => ({
    disabled: record.name === "Disabled User",
    // Column configuration not to be checked
    name: record.name,
  }),
};

const AdminSchedule = () => {
  //TODAY'S DATE
  const date = new dayjs();
  console.log();
  const [selectionType, setSelectionType] = useState("checkbox");
  const [quarterValue, setQuarterValue] = useState(null);

  const [todayDate, setTodayDate] = useState(
    date.format("dddd, MMMM D, YYYY ")
  );

  // HANDLE DATE CHANGE CONNECTED TO THE DATEPICKER
  const handleDateChange = (date, dateString) => {
    setQuarterValue(dateString);
  };
  
 //RETRIEVE DATA FOR PREVIOUS WEEK
  const handlePreviousWeek = () => {
   
  };
   //RETRIEVE DATA FOR NEXT WEEK
  const handleNextWeek = () => {
   
  };

  return (
    <div className="adminScheduleContainer">
      <div className="adminScheduleTitle">
        <h1>Admin Schedule</h1>
      </div>
      <div className="adminScheduleDates">
      <DatePicker onChange={handleDateChange} />
        <h2> {todayDate}</h2>
        <div className="adminIconArrows">
          <ArrowLeftOutlined
            style={{ fontSize: "24px", color: "#08c" }}
            onClick={handlePreviousWeek}
          />
          <ArrowRightOutlined
            style={{ fontSize: "24px", color: "#08c" }}
            onClick={handleNextWeek}
          />
        </div>
      </div>

      <Divider />

      <Table
        rowSelection={{
          type: selectionType,
          ...rowSelection,
        }}
        columns={columns}
        dataSource={data}
      />
    </div>
  );
};

export default AdminSchedule;
