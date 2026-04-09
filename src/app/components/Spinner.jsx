import React from "react";

const Spinner = (props) => {
  // return <div className="w-5 h-5 border-2 border-t-transparent border-white rounded-full animate-spin" />;
  return props.color ? <div className="w-5 h-5 border-2 border-t-transparent border-my-white rounded-full animate-spin" /> : <div className="w-5 h-5 border-2 border-t-transparent border-my-orange rounded-full animate-spin" />;
};

export default Spinner;
