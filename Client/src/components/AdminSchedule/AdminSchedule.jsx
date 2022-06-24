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
  useEffect(() => {
    const getSchedule = async () => {
      try {
        const response = await axiosInstance.get("/admin/");
        console.log(response.data);
        setStandardStudents(response.data.standardStudents);
        setModifiedStudents(response.data.modifiedStudents);
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
  const [standardStudents, setStandardStudents] = useState(null);
  const [modifiedStudents, setModifiedStudents] = useState(null);

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

  const modifiedColumns = [
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

  const standardColumns = [
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
  ];

  const modifiedData =
    modifiedStudents && modifiedStudents.map((student) => student);
  const standardData =
    standardStudents && standardStudents.map((student) => student);

  return (
    <div className="adminScheduleContainer">
      <div className="adminScheduleTitle">
        <h1>Admin Schedule</h1>
      </div>
      <div className="adminScheduleDates">
        <h2> {todayDate}</h2>
      </div>

      <Divider />
      <h1>Modified Dismissals</h1>
      <Table
        // rowSelection={{
        //   type: selectionType,
        //   ...rowSelection,
        // }}
        columns={modifiedColumns}
        dataSource={modifiedData}
      />

      <Divider />
      <h1>Standard Dismissals</h1>
      <Table
        // rowSelection={{
        //   type: selectionType,
        //   ...rowSelection,
        // }}
        columns={standardColumns}
        dataSource={standardData}
      />
    </div>
  );
};

export default AdminSchedule;
