import React from "react";
import ReactDOM from "react-dom";
import { useDispatch } from "react-redux";
import { setModal } from "../../features/modalSlice";

import "./Modal.css";

const Modal = ({ component }) => {
  const dispatch = useDispatch();
  const newComponent = (
    <div className="modal-container flx clm max jus-ct al-ct relative">
      <section className="modal flx clm pd-s relative">
        <div className="flx" style={{ justifyContent: "flex-end" }}>
          <button
            onClick={() => dispatch(setModal(false))}
            style={{
              all: "initial",
              fontFamily: "inherit",
              cursor: "pointer",
              color: "inherit",
            }}
          >
            Close
          </button>
        </div>
        {component}
      </section>
    </div>
  );
  return ReactDOM.createPortal(newComponent, document.getElementById("modal"));
};

export default React.memo(Modal);
