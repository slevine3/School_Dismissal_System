import React from "react";
import "./Home.css";
import CurrentSchedule from "../../components/CurrentSchedule/CurrentSchedule";
import UpdateSchedule from "../../components/UpdateSchedule/UpdateSchedule";
import { Link } from "react-router-dom";
import { Button } from "antd";
import CurrentSchedule2 from "../../components/CurrentSchedule2/CurrentSchedule2";

const Home = () => {
  return (
    <div className="homeContainer">
      <h1 className="homeTitle">Dismissal Schedule</h1>
      <div className="homeComponentContainer">
        <CurrentSchedule2 />

        <div className="homeButton">
          <Link to="/update">
            <Button type="primary">Create New Dismissal</Button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Home;
