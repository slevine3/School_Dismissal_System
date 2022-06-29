import React from "react";
import "./Home.css";
import CurrentSchedule from "../../components/CurrentSchedule/CurrentSchedule";
import { Link } from "react-router-dom";
import { Button } from "antd";

const Home = () => {
  return (
    <div className="homeContainer">
      <CurrentSchedule />
    </div>
  );
};

export default Home;
