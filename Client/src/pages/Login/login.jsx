import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { axiosInstance } from "../../requestMethods";

const Login = () => {
  const [user_id, setUser_id] = useState(1);
  const [isAdmin, setIsAdmin] = useState(1);
  const navigate = useNavigate();
  const getStudents = async () => {
    try {
      const response = await axiosInstance.post("/user/students", {
        user_id,
      });
      let isAdmin = response.data.isAdmin[0].is_admin;
      let students = response.data.students;
      isAdmin ? navigate("/admin") : navigate("/update", { state: { students } });
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        textAlign: 'center',
        height: "100vh",
        backgroundImage: "linear-gradient(to right,#bab5f8, #190abe)",
      }}
    >
      <h1 style={{ marginBottom: "50px" }}>
        Login Page For Demo Purpose Only:
      </h1>

      <select
        onChange={(e) => setUser_id(e.target.value)}
        style={{ marginBottom: "50px" }}
      >
        <option value="1">Smith Family</option>
        <option value="2">Williams Family</option>
        <option value="3">Davis Family</option>
        <option value="4">Admin</option>
      </select>

      <button onClick={getStudents}>Login</button>
    </div>
  );
};

export default Login;
