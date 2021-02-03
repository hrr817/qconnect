import React, { useState } from "react";
import app from "firebase/app";
import "firebase/auth";

import { useSelector, useDispatch } from "react-redux";
import { selectUser } from "../../features/userSlice";
import { selectModal, setModal } from "../../features/modalSlice";

import Modal from "../Modal/Modal";
import SignInForm from "../Forms/SignInForm";
import "./Navbar.css";

const changeTheme = (newTheme) => {
  let html = document.getElementsByTagName("html")[0];
  let theme = html.getAttribute("data-theme");
  switch (newTheme) {
    case "light": {
      html.setAttribute("data-theme", "light");
      break;
    }
    case "dark": {
      html.setAttribute("data-theme", "dark");
      break;
    }
    default: {
      html.setAttribute("data-theme", "light");
    }
  }

  return theme;
};

const Navbar = () => {
  const user = useSelector(selectUser);
  const modal = useSelector(selectModal);
  const dispatch = useDispatch();

  const [dropdown, setDropDown] = useState(false);
  const [theme, setTheme] = useState(
    document.getElementsByTagName("html")[0].getAttribute("data-theme")
  );

  const toggleTheme = () => {
    if (theme === "light") {
      setTheme("dark");
      changeTheme("dark");
    } else if (theme === "dark") {
      setTheme("light");
      changeTheme("light");
    }
  };

  return (
    <>
      {modal && <Modal component={<SignInForm className="" />} />}
      <nav className="navbar flx aln-ct relative">
        <a className="pd-m link" href="/">
          Qconnect
        </a>
        <div className="flx al-ct">
          {user ? (
            user.name
          ) : (
            <button
              onClick={() => dispatch(setModal(true))}
              style={{
                all: "initial",
                fontFamily: "inherit",
                cursor: "pointer",
                color: "inherit",
              }}
            >
              Get started
            </button>
          )}
          <div
            className="pd-m"
            onClick={() => setDropDown(!dropdown)}
            style={{ cursor: "pointer" }}
          >
            <span
              className={`arrow-down${dropdown ? " ad-active" : ""}`}
            ></span>
          </div>

          {/* Dropdown Menu */}
          {dropdown && (
            <div className="fl clm drop-down-menu pd-s">
              <div
                className="flx spc-btw pd-s"
                onClick={() => toggleTheme()}
                style={{ cursor: "pointer" }}
              >
                Theme (
                <span style={{ textTransform: "capitalize" }}> {theme} </span>)
              </div>
              <div className="flx spc-btw pd-s" style={{ cursor: "pointer" }}>
                <span>About</span>
              </div>
              {user && (
                <div className="flx spc-btw pd-s">
                  <button
                    onClick={() => app.auth().signOut()}
                    style={{
                      all: "initial",
                      fontFamily: "inherit",
                      cursor: "pointer",
                      color: "inherit",
                    }}
                  >
                    Sign out
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </nav>
    </>
  );
};

export default React.memo(Navbar);
