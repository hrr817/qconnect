import React from "react";
import "./Message.css";

const Message = ({ data, fromUser }) => {
  return (
    <div className={`mr-s message${fromUser ? " text-right" : ""}`}>
      <div className="text">{data.text}</div>
      <br />
      <div className="mr-s">{data.from}</div>
    </div>
  );
};

export default React.memo(Message);
