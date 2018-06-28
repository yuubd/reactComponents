import React from "react";

function Circle(props) {
  return (
    <div className="circle">
      <img src={props.source} alt="logo" />
      <p>{props.name}</p>
    </div>
  );
}
export default Circle;
