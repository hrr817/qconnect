import React from "react";
import { ReactComponent as LockIcon } from "../assets/icons/lock.svg";
import { ReactComponent as GroupIcon } from "../assets/icons/group.svg";
import "./RoomsList.css";

const RoomsList = ({ rooms = [], currentRoom, setCurrentRoom }) => {
  return (
    <section className="rooms-container flx clm">
      {rooms.map((room) => (
        <div
          className={`flx al-ct room ${
            currentRoom === room.id ? "active-room" : ""
          }`}
          key={room.id}
          onClick={() => setCurrentRoom(room.id)}
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
