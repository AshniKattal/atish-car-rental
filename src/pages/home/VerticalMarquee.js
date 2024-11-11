import React from "react";
import "./VerticalMarquee.css";

const VerticalMarquee = ({ items }) => {
  return (
    <div className="marquee-container">
      <div className="marquee">
        <div className="marquee-content">
          {items.map((item, index) => (
            <div key={index} className="marquee-item">
              {item}
            </div>
          ))}
          {/*    {items.map((item, index) => (
            <div key={`repeat-${index}`} className="marquee-item">
              {item}
            </div>
          ))} */}
        </div>
      </div>
      <div className="marquee">
        <div className="marquee-content reverse">
          {items.map((item, index) => (
            <div key={index} className="marquee-item">
              {item}
            </div>
          ))}
          {/*   {items.map((item, index) => (
            <div key={`repeat-${index}`} className="marquee-item">
              {item}
            </div>
          ))} */}
        </div>
      </div>
    </div>
  );
};

export default VerticalMarquee;
