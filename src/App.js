import React, { useEffect, useState, useCallback } from "react";
import firebase from "firebase/app";
import "firebase/auth";
import "firebase/firestore";

/* redux */
import { useDispatch } from "react-redux";
import { setUser, clearUser } from "./features/userSlice";

/* Style */
import "./styles/default.css";

/* Components */
import Navbar from "./components/Navbar";
import CreateRoomForm from "./components/CreateRoomForm";
import RoomsList from "./components/RoomsList";
import ChatRoom from "./components/ChatRoom";

/* firebase configurations */
import { firebaseConfig } from "./firebaseConfig";
import Loading from "./components/Loading";

const app = firebase.initializeApp(firebaseConfig);

function App() {
  const dispatch = useDispatch();

  const [loading, setLoading] = useState(true);
  const [rooms, setRooms] = useState([]);
  const [currentRoom, setCurrentRoom] = useState();

  const setCurrentRoomCallBack = useCallback((val) => setCurrentRoom(val), [
    setCurrentRoom,
  ]);

  useEffect(() => {
    let timeout;

    // Look out for user if logged in or not
    app.auth().onAuthStateChanged((res) => {
      setLoading(true);
      if (res) {
        const { displayName, uid, photoURL } = res;
        dispatch(
          setUser({
            id: uid,
            name: displayName,
            photoURL,
          })
        );
        timeout = setTimeout(() => setLoading(false), 500);
      } else {
        dispatch(clearUser());
        timeout = setTimeout(() => setLoading(false), 500);
      }
    });

    // Get rooms names
    app
      .firestore()
      .collection("rooms")
      .limit(5)
      .onSnapshot((res) => {
        let temp = [];
        res.docs.forEach((doc) => {
          const { room_name, members, isPrivate, admin } = doc.data();
          temp.push({
            id: doc.id,
            name: room_name,
            members: members,
            private: isPrivate,
            admin,
          });
        });
        setRooms([...temp]);
      });

    return () => {
      clearTimeout(timeout);
    };
  }, [dispatch]);

  return (
    <>
      {loading && <Loading />}
      <Navbar />
      <div className="container max">
        {/* Chat Room */}
        <ChatRoom currentRoom={currentRoom} />
        {/* List of rooms */}
        <RoomsList
          rooms={rooms}
          currentRoom={currentRoom}
          setCurrentRoom={setCurrentRoomCallBack}
        />
      </div>
      {/* <section>
        {user ? (
          <>
            <CreateRoomForm user={user} />
            <button onClick={() => app.auth().signOut()}>Sign Out</button>
          </>
        ) : (
          <SignInForm setUser={setUserCallback} />
        )}
      </section> */}
    </>
  );
}

export default App;
