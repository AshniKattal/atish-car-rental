import React from "react";

const CustomEvent = ({ event }) => {
  // Customize the color based on your event data
  const eventColor = event.extendedProps.eventColor || "#3788d8"; // Default color

  return (
    <div
      className="fc-event"
      style={{
        backgroundColor: eventColor,
        borderColor: eventColor,
        color: "#fff", // Text color
        height: "100%",
        width: "100%",
        overflow: "hidden",
        fontSize: "18px",
      }}
    >
      {event.title}
    </div>
  );
};

export default CustomEvent;
