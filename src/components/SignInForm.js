import React, { useState } from "react";
import app from "firebase/app";

import { useDispatch } from "react-redux";
import { setUser } from "../features/userSlice";
import "firebase/auth";

import "./Forms.css";

const SignInForm = () => {
  const dispatch = useDispatch();
  const [name, setName] = useState("");

  const submitHandler = (e) => {
    e.preventDefault();

    if (name.length < 3) return;

    app
      .auth()
      .setPersistence(app.auth.Auth.Persistence.LOCAL)
      .then(async () => {
        try {
          await app.auth().signInAnonymously();
          app
            .auth()
            .currentUser.updateProfile({
              displayName: name,
            })
            .then(() => {
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
              }
            })
            .catch((err) => console.log(err));
        } catch (err_1) {
          return console.log(err_1);
        }
      })
      .catch((err) => console.log(err));
  };

  return (
    <form
      onSubmit={(e) => submitHandler(e)}
      className="form flx clm jus-ct pd-s"
    >
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
          className="fn-s"
          style={{ margin: "0.5em auto", padding: "0.4em 1.5em" }}
        />
      </div>
    </form>
  );
};

export default SignInForm;
