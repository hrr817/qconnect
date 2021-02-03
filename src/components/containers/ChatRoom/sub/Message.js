import React, { Fragment } from "react";
import "./Message.css";

const Message = ({ data, fromUser }) => {
  return (
    <>
      <div
        className={`mr-s${fromUser ? " text-right" : ""}`}
        style={{ marginBottom: "0.5em" }}
      >
        <div className="msg-box">
          <span className="msg-text flx">{data.text}</span>
          {!fromUser && <span className="msg-author">{data.from}</span>}
        </div>
      </div>
    </>
  );
};

export default React.memo(Message);
