import React, { useState } from "react";
import app from "firebase/app";

import { useDispatch } from "react-redux";
import { setUser } from "../../features/userSlice";
import "firebase/auth";

import Loading from "../Loading/Loading";

import "./Forms.css";
import { setModal } from "../../features/modalSlice";

const SignInForm = () => {
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const [name, setName] = useState("");

  const createUserData = (userId, data) => {
    app.firestore().collection("users").doc(userId).set(data);
  };

  const submitHandler = (e) => {
    e.preventDefault();
    setLoading(true);

    if (name.length < 3) return;

    app
      .auth()
      .setPersistence(app.auth.Auth.Persistence.LOCAL)
      .then(() => {
        return app
          .auth()
          .signInAnonymously()
          .then(() => {
            setLoading(false);
            app
              .auth()
              .currentUser.updateProfile({
                displayName: name,
              })
              .then(() => {
                dispatch(setModal(false));

                // On success
                const userData = app.auth().currentUser;

                if (userData != null) {
                  const { displayName, uid, photoURL } = userData;
                  dispatch(
                    setUser({
                      id: uid,
                      name: displayName,
                      photoURL,
                    })
                  );

                  // create user data
                  createUserData(uid, { my_rooms: [] });
                }
              });
          });
      })
      .catch((err) => {
        setLoading(false);
        dispatch(setModal(false));
        console.log(err);
      });
  };

  return (
    <form
      onSubmit={(e) => submitHandler(e)}
      className="form flx clm jus-ct pd-s"
    >
      {loading && <Loading />}
      <div className="flx clm">
        <label htmlFor="Username" className="fn-s mr-s text-center">
          Username (required)
        </label>
        <input
          onChange={(e) => setName(e.target.value)}
          type="text"
          className="inpt pd-s"
          autoComplete="true"
          required
        />
        <input
          type="submit"
          value="Start using"
          className="fn-s form-btn"
          style={{
            margin: "0.5em auto",
            padding: "0.4em 1.5em",
          }}
        />
      </div>
    </form>
  );
};

export default SignInForm;
