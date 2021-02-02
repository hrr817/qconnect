import React, { useState, useEffect, useCallback } from "react";
import app from "firebase/app";

import { useSelector } from "react-redux";
import { selectUser } from "../features/userSlice";

import "firebase/firestore";

import Message from "./Message";
import InputBar from "./InputBar";

const ChatRoom = ({ currentRoom }) => {
  const user = useSelector(selectUser);
  const [loading, setLoading] = useState(false);
  const [roomData, setRoomData] = useState();
  const [messages, setMessages] = useState([]);

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
        .then((res) => console.log("Sent"))
        .catch((err) => console.log(err));
    },
    [currentRoom, user]
  );

  if (loading)
    return (
      <div className="chats-container max">
        <div className="flx max jus-ct al-ct">Loading...</div>
      </div>
    );

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
                key={messageData.text + messageData.user_id}
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
