import React, { useState, useRef } from "react";
import app from "firebase/app";
import "firebase/firestore";
import "firebase/auth";

import "./Forms.css";
import { useSelector } from "react-redux";
import { selectUser } from "../../features/userSlice";

const CreateRoomForm = ({ setShowCreateRoom }) => {
  const user = useSelector(selectUser);

  const [isPrivate, setPrivate] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const roomNameRef = useRef();
  const passwordRef = useRef();

  const submitHandler = (e) => {
    e.preventDefault();

    const data = {
      room_name: roomNameRef.current.value,
      isPrivate: isPrivate,
      createdBy: "",
      createdAt: new Date().valueOf(),
      messages: [],
      members: [user.id],
      admin: [user.name],
    };

    if (isPrivate) {
      data.password = passwordRef.current.value;
    }

    app
      .firestore()
      .collection("rooms")
      .add(data)
      .then((docRef) => {
        // console.log(docRef.);
        setShowCreateRoom(false);
      })
      .catch((err) => console.log(err));
  };

  return (
    <form
      onSubmit={(e) => submitHandler(e)}
      className="flx clm jus-ct max pd-s bg"
      style={{ borderBottom: "1px solid #cecece" }}
    >
      <div className="flx clm">
        <label htmlFor="Room Name" className="fn-s mr-s">
          Room Name (required)
        </label>
        <input
          ref={roomNameRef}
          type="text"
          className="inpt pd-s"
          autoComplete="true"
          required
        />
      </div>

      <>
        <div className={`${isPrivate ? "flx " : "hidden "}clm`}>
          <label htmlFor="Password" className="fn-s mr-s">
            Password (required)
          </label>
          <div className="flx al-ct" style={{ position: "relative" }}>
            <input
              ref={passwordRef}
              type={showPassword ? "text" : "password"}
              className="inpt pd-s"
              style={{ width: "100%" }}
              autoComplete="current-password"
              required
            />
            <span
              className="fn-s"
              style={{
                position: "absolute",
                right: 0,
                padding: "0.4em",
                marginRight: "0.9em",
                background: "#cecece",
                borderRadius: "0.2em",
              }}
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? "Hide" : "Show"}
            </span>
          </div>
        </div>

        <div className="flx al-ct mr-s" style={{ justifyContent: "flex-end" }}>
          <input
            type="checkbox"
            name="hasPassword"
            className="inpt"
            id="private"
            onChange={() => setPrivate(!isPrivate)}
          />
          <span className="fn-s" style={{ margin: "0 0.5em" }}>
            Private
          </span>
        </div>
      </>
      <input
        type="submit"
        value="Create Room"
        className="fn-s form-btn"
        style={{ margin: "0.1em auto", padding: "0.4em 1.5em" }}
      />
    </form>
  );
};

export default React.memo(CreateRoomForm);
