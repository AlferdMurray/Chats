import React from "react";

const Popup = ({ message, type, onClose }) => {
    return (
      <div className="popup-overlay d-flex justify-content-center align-items-center">
        <div className={`popup-box ${type === "success" ? "bg-success" : "bg-danger"} text-light p-3 rounded`}>
          <p>{message}</p>
          <button className="btn btn-light mt-2" onClick={onClose}>Close</button>
        </div>
      </div>
    );
  };

export default Popup