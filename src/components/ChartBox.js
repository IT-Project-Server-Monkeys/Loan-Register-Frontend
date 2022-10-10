import React from "react";

// a box with text in it
const ChartBox = (props) => {
  return (
    <div className={"chart-box"} style={props.style}>{props.children}</div>
  );
};

export default ChartBox;
