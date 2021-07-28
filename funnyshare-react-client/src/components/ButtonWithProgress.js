import React from "react";

function ButtonWithProgress(props) {
  return (
    <button
      className={props.className || "btn btn-primary"}
      onClick={props.onClick}
      disabled={props.disabled}
    >
      {props.pendingApiCall && (
        <div
          className="spinner-border text-light spinner-border-sm"
          role="status"
        >
          <span className="visually-hidden">Loading...</span>
        </div>
      )}
      <span>{props.text}</span>
    </button>
  );
}

export default ButtonWithProgress;
