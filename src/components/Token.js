import React from "react";
import TokenBlot from "../quill/TokenBlot";

const TAG = TokenBlot.tagName.toLowerCase();

const Token = ({ title, slug, id }) => {
  const onDragStart = event => {
    const text = `{{${slug}|${id}}}`;
    const json = JSON.stringify({ title, slug, id });
    event.dataTransfer.setData("text/plain", text);
    event.dataTransfer.setData("application/vnd.placeholder.token", json);
  };

  return (
    <TAG
      className={TokenBlot.className}
      draggable="true"
      onDragStart={onDragStart}
    >
      {title}
    </TAG>
  );
};

export default Token;
