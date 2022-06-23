import { Button } from "antd";
import React from "react";
import { Link } from "react-router-dom";
import UpdateSchedule from "../../components/UpdateSchedule/UpdateSchedule";

const Update = () => {
  return (
    <div className="updateContainer">
      <UpdateSchedule />
      <div className="updateButton">
        <Link to="/">
          <Button type="primary">Add to Schedule</Button>
        </Link>
      </div>
    </div>
  );
};

export default Update;
