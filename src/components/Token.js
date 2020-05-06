import React from "react";

const Token = ({ title, slug, id }) => {
  const onDragStart = event => {
    const text = `{{${slug}|${id}}}`;
    const json = JSON.stringify({ title, slug, id });
    event.dataTransfer.setData("text/plain", text);
    event.dataTransfer.setData("application/vnd.placeholder.token", json);
  };
  return (
    <span className="token" draggable="true" onDragStart={onDragStart}>
      {title}
    </span>
  );
};

export default Token;
