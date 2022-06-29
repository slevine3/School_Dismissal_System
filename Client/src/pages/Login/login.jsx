import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { axiosInstance } from "../../requestMethods";
import { Button, Select } from "antd";
const { Option } = Select;

const Login = () => {
  const [user_id, setUser_id] = useState(null);
  const [error, setError] = useState(null);

  const navigate = useNavigate();

  const getStudents = async () => {
    if (user_id === null) {
      setError("Please select a user");
    } else {
      try {
        const response = await axiosInstance.get("/users/students", {
          params: { user_id },
        });
        let isAdmin = response.data.isAdmin[0]?.is_admin;
        let students = response.data.students;

        isAdmin ? navigate("/admin") : navigate("/", { state: { students } });
      } catch (error) {
        console.log(error);
      }
    }
  };
  const handleChange = (value) => {
    setUser_id(value.value);
  };

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        textAlign: "center",
        height: "100vh",
        backgroundColor: "lightpink",
      }}
    >
      <h1 style={{ marginBottom: "50px" }}>Demo Login</h1>
      <Select
        defaultValue="Select User"
        labelInValue
        style={{
          width: 175,
          marginBottom: "30px",
        }}
        onChange={handleChange}
      >
        <Option value="1">Smith Family</Option>
        <Option value="2">Williams Family</Option>
        <Option value="3">Davis Family</Option>
        <Option value="4">Admin</Option>
      </Select>
      {
        <h3
          style={{
            color: "red",
            marginBottom: "20px",
          }}
        >
          {error}
        </h3>
      }
      <Button
        onClick={getStudents}
        style={{
          width: 175,
          border: "1px solid black",
        }}
      >
        Login
      </Button>
    </div>
  );
};

export default Login;
