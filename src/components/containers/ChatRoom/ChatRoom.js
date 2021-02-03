import React, { useState, useEffect, useCallback, useRef } from "react";
import app from "firebase/app";

import { useSelector } from "react-redux";
import { selectUser } from "../../../features/userSlice";

import "firebase/firestore";

import Message from "./sub/Message";
import InputBar from "../../InputBar/InputBar";

const ChatRoom = ({ currentRoom }) => {
  const user = useSelector(selectUser);
  const [loading, setLoading] = useState(false);
  const [roomData, setRoomData] = useState();
  const [messages, setMessages] = useState([]);
  const [passwordMatched, setPasswordMatched] = useState(false);
  const [error, setError] = useState();

  const passwordInputRef = useRef("");

  useEffect(() => {
    let timeout;
    if (currentRoom) {
      setLoading(true);
      // Get room data
      app
        .firestore()
        .collection("rooms")
        .doc(currentRoom)
        .onSnapshot((doc) => setRoomData(doc.data()));
      // Get messages
      app
        .firestore()
        .collection("rooms")
        .doc(currentRoom)
        .collection("messages")
        .orderBy("timestamp")
        .onSnapshot((res) => {
          const temp = [];
          res.docs.forEach((message) => {
            temp.push(message.data());
          });
          setMessages([...temp]);
        });
      setTimeout(() => {
        setLoading(false);
      }, 500);
    }

    return () => {
      clearTimeout(timeout);
    };
  }, [currentRoom]);

  const sendMessage = useCallback(
    (text) => {
      app
        .firestore()
        .collection("rooms")
        .doc(currentRoom)
        .collection("messages")
        .add({
          text: text,
          from: user.name,
          user_id: user.id,
          timestamp: new Date().valueOf(),
        })
        .then((res) => console.log())
        .catch((err) => console.log(err));
    },
    [currentRoom, user]
  );

  const passwordSubmitHandler = (e) => {
    e.preventDefault();
    if (passwordInputRef.current.value === roomData.password)
      setPasswordMatched(true);
    else setError(true);
  };

  if (loading)
    return (
      <div className="chats-container max">
        <div className="flx max jus-ct al-ct">Loading...</div>
      </div>
    );

  if (roomData && roomData.isPrivate && !passwordMatched) {
    if (!user) {
      return (
        <div className="chats-container max">
          <div className="flx max jus-ct al-ct">
            Please sign in to view this room.
          </div>
        </div>
      );
    } else {
      return (
        <div className="chats-container max">
          <div className="flx clm max jus-ct al-ct">
            {user.name && <h2>Hey, {user.name}!</h2>}
            <span>Please enter password to join room.</span>
            <br />
            {error && (
              <span style={{ color: "red" }}>Password did not match!</span>
            )}
            <form
              onSubmit={(e) => passwordSubmitHandler(e)}
              className="flx aln-ct"
            >
              <input
                type="password"
                placeholder="Enter Password"
                className="mr-s pd-s"
                ref={passwordInputRef}
                style={{ borderColor: error ? "red" : "#cecece" }}
                autoComplete="true"
              />
              <input type="submit" value="Go" className="mr-s pd-s" />
            </form>
          </div>
        </div>
      );
    }
  }

  return (
    <section
      className={`chats-container clm max relative${
        !messages.length ? " jus-ct al-ct" : ""
      }`}
    >
      <div className="messages-container max">
        {roomData ? (
          !messages.length ? (
            <div className="flx max jus-ct al-ct">No messages</div>
          ) : (
            messages.map((messageData) => (
              <Message
                key={
                  messageData.user_id +
                  "-" +
                  messageData.timestamp +
                  "-" +
                  messageData.text
                }
                data={messageData}
                fromUser={messageData.user_id === (user && user.id) || false}
              />
            ))
          )
        ) : (
          <div className="flx max jus-ct al-ct text-center">
            Select some chat room
            <br /> and start chatting.
          </div>
        )}
        <br />
      </div>
      {currentRoom && (
        <div className="input-bar pd-s">
          <InputBar sendMessage={sendMessage} />
        </div>
      )}
    </section>
  );
};

export default React.memo(ChatRoom);
