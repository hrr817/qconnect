import React, { useRef } from "react";
import { useSelector } from "react-redux";
import { selectUser } from "../../features/userSlice";
// import { ReactComponent as AddImageIcon } from "../../assets/icons/add-image.svg";

import "./InputBar.css";

const InputBar = ({ sendMessage }) => {
  const user = useSelector(selectUser);
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
      className="flx relative"
      style={{ width: "100%" }}
    >
      {!user && (
        <div className="protected max flx jus-ct al-ct pd-s">
          Please sign in to write here.
        </div>
      )}
      <div className="flx al-ct relative" style={{ width: "100%" }}>
        <input type="text" className="message-input pd-s" ref={inputRef} />
        {/* <span className="files-btn flx jus-ct al-ct">
          <AddImageIcon />
        </span> */}
      </div>
      <button className="send-btn pd-s">Send</button>
    </form>
  );
};

export default React.memo(InputBar);
