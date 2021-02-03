import React, { useCallback, useState } from "react";
import app from "firebase/app";
import "firebase/firestore";

import { selectUser } from "../../../features/userSlice";
import { useSelector } from "react-redux";

import CreateRoomForm from "../../Forms/CreateRoomForm";

import { ReactComponent as LockIcon } from "../../../assets/icons/lock.svg";
import { ReactComponent as GroupIcon } from "../../../assets/icons/group.svg";
import "./RoomsList.css";

const RoomsList = ({ rooms = [], currentRoom, setCurrentRoom }) => {
  const user = useSelector(selectUser);

  const [showCreateRoom, setShowCreateRoom] = useState(false);

  // change current room
  const clickHandler = (roomId) => {
    // set current room so UI rerenders with new room's data
    setCurrentRoom(roomId);
    if (user) {
      // get current data of user current room
      app
        .firestore()
        .collection("users")
        .doc(user.id)
        .get()
        .then((res) => {
          // on success
          const roomList = res.data().my_rooms;
          // user has empty list so add
          if (!roomList.length) {
            app
              .firestore()
              .collection("users")
              .doc(user.id)
              .update({ my_rooms: [roomId] })
              .catch((err) => console.log(err));
          } else {
            let exist = false;
            roomList.forEach((id) => id === roomId && (exist = true));
            if (!exist) {
              app
                .firestore()
                .collection("users")
                .doc(user.id)
                .update({ my_rooms: [...roomList, roomId] })
                .catch((err) => console.log(err));
            }
          }

          // check if current user is member is current room
          app
            .firestore()
            .collection("rooms")
            .doc(roomId)
            .get()
            .then((res) => {
              const members = res.data().members; // Array

              let isAMember = false;
              members.forEach((id) => id === user.id && (isAMember = true));

              // if not a member, add as a member
              if (!isAMember) {
                app
                  .firestore()
                  .collection("rooms")
                  .doc(roomId)
                  .update({ members: [...members, user.id] });
              }
            })
            .catch((err) => console.log(err));
        })
        .catch((err) => console.log(err));
    }
  };

  const setShowCreateRoomCallback = useCallback(
    (param) => setShowCreateRoom(param),
    [setShowCreateRoom]
  );

  return (
    <section className="rooms-container flx clm relative">
      {user && (
        <div className="flx clm jus-ct al-ct float-bottom bg">
          {showCreateRoom && (
            <CreateRoomForm setShowCreateRoom={setShowCreateRoomCallback} />
          )}
          <div
            className="max text-center pd-m"
            onClick={() => setShowCreateRoom(!showCreateRoom)}
            style={{ cursor: "pointer" }}
          >
            {showCreateRoom ? "Close" : "Create Room"}
          </div>
        </div>
      )}
      {rooms.map((room) => (
        <div
          className={`flx al-ct room ${
            currentRoom === room.id ? "active-room" : ""
          }`}
          key={room.id}
          onClick={() => clickHandler(room.id)}
        >
          <div className="icon-big" style={{ marginRight: "0.5em" }}>
            <GroupIcon />
          </div>
          <div className="flx clm" style={{ marginLeft: "0.5em" }}>
            <div className="flx al-ct">
              <h1>{room.name}</h1>
              {room.private && (
                <span className="icon mr-s">
                  <LockIcon />
                </span>
              )}
            </div>
            <span className="fn-s">
              <span
                className="bg-green round box-2em in-flx jus-ct al-ct pd-s"
                style={{ fontSize: "0.8em" }}
              >
                {room.members.length}
              </span>{" "}
              people has joined the chat.
            </span>
            <p className="fn-s">
              Started by <span className="royalblue">{room.admin}</span>
            </p>
          </div>
        </div>
      ))}
    </section>
  );
};

export default React.memo(RoomsList);
