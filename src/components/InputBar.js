import React, { useRef } from "react";
import { ReactComponent as AddImageIcon } from "../assets/icons/add-image.svg";

import "./InputBar.css";

const InputBar = ({ sendMessage }) => {
  const inputRef = useRef();

  const submitHandler = (e) => {
    e.preventDefault();
    const text = inputRef.current.value;
    if (text === "") return;
    sendMessage(text);
    inputRef.current.value = "";
  };

  return (
    <form
      onSubmit={(e) => submitHandler(e)}
      className="flx"
      style={{ width: "100%" }}
    >
      <div className="flx al-ct relative" style={{ width: "100%" }}>
        <input type="text" className="message-input pd-s" ref={inputRef} />
        <span className="files-btn flx jus-ct al-ct">
          <AddImageIcon />
        </span>
      </div>
      <button className="send-btn pd-s">Send</button>
    </form>
  );
};

export default React.memo(InputBar);
