import React from "react";
import ReactDOM from "react-dom";
import "./Modal.css";

const Modal = ({ component, setShowModal }) => {
  const newComponent = (
    <div className="modal-container flx clm max jus-ct al-ct">
      <section className="modal flx clm pd-s relative">
        <div className="flx" style={{ justifyContent: "flex-end" }}>
          <button
            onClick={() => setShowModal(false)}
            style={{
              all: "initial",
              fontFamily: "inherit",
              cursor: "pointer",
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
