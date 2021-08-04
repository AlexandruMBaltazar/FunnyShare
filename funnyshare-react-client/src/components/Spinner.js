import React from "react";

function Spinner() {
  return (
    <div className="d-flex">
      <div className="spinner-border mx-auto">
        <span className="visually-hidden">Loading...</span>
      </div>
    </div>
  );
}

export default Spinner;
