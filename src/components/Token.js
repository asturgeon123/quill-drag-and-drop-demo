import React from "react";

import insertToken from "../quill/insertToken";
import TokenBlot from "../quill/TokenBlot";

const TAG = TokenBlot.tagName.toLowerCase();

const Token = ({ title, slug, id, quillRef }) => {
  const tokenData = { title, slug, id };
  const onDragStart = event => {
    const text = `{{${slug}|${id}}}`;
    const json = JSON.stringify({ title, slug, id });
    event.dataTransfer.setData("text/plain", text);
    event.dataTransfer.setData("application/vnd.placeholder.token", json);
  };

  const onClick = () => {
    const quill = quillRef.current;
    if (quill) {
      insertToken(quill, tokenData);
    }
  };

  return (
    <TAG
      className={TokenBlot.className}
      draggable="true"
      onDragStart={onDragStart}
      onClick={onClick}
      role="button"
    >
      {title}
    </TAG>
  );
};

export default Token;
