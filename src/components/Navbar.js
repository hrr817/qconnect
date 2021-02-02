import React, { useState, useCallback } from "react";
import app from "firebase/app";
import "firebase/auth";

import { useSelector } from "react-redux";
import { selectUser } from "../features/userSlice";

import Modal from "./Modal";
import SignInForm from "./SignInForm";
import "./Navbar.css";

const Navbar = () => {
  const user = useSelector(selectUser);
  const [dropdown, setDropDown] = useState(false);
  const [showModal, setShowModal] = useState(false);

  const setShowModalCallback = useCallback((val) => setShowModal(val), [
    setShowModal,
  ]);

  return (
    <>
      {showModal && (
        <Modal
          component={<SignInForm className="" />}
          setShowModal={setShowModalCallback}
        />
      )}
      <nav className="navbar flx aln-ct relative">
        <a className="pd-m link" href="/">
          Qconnect
        </a>
        <div className="flx al-ct">
          {user ? (
            user.name
          ) : (
            <button
              onClick={() => setShowModal(true)}
              style={{
                all: "initial",
                fontFamily: "inherit",
                cursor: "pointer",
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
              <div className="flx spc-btw pd-s">
                <span>Theme</span>
                <span>Dark</span>
              </div>
              <div className="flx spc-btw pd-s">
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
