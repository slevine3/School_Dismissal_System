import React from "react";
import axios from "axios";
const Test = () => {
  const handleClick = async () => {
    try {
      const data = await axios.get("http://localhost:5000/api/schedule/users");
      console.log(data);
    } catch (error) {}
  };
  return (
    <div>
      <button onClick={handleClick}>RETRIEVE USERS</button>
    </div>
  );
};

export default Test;
