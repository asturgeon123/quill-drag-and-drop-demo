import React, { useState } from "react";

import insertToken from "../quill/insertToken";
import TokenBlot from "../quill/TokenBlot";

const Token = ({ title, slug, id, inputs }) => {
  const [menuVisible, setMenuVisible] = useState(false);
  const tokenData = { title, slug, id };
  const onDragStart = event => {
    const text = `{{${slug}|${id}}}`;
    const json = JSON.stringify({ title, slug, id });
    event.dataTransfer.setData("text/plain", text);
    event.dataTransfer.setData("application/vnd.placeholder.token", json);
  };

  const onClickToken = () => {
    setMenuVisible(!menuVisible);
  };

  const onClickInput = quillRef => () => {
    const quill = quillRef && quillRef.current;
    if (quill) {
      insertToken(quill, tokenData);
    }
  };

  const onMount = node => {
    node &&
      node.addEventListener("focusout", event => {
        if (!node.contains(event.relatedTarget)) {
          setMenuVisible(false);
        }
      });
  };

  return (
    <li ref={onMount}>
      <button
        className={TokenBlot.className}
        draggable="true"
        onDragStart={onDragStart}
        onClick={onClickToken}
        type="button"
      >
        {title}
      </button>
      {menuVisible && (
        <ul>
          {inputs.map(({ label, quillRef }) => (
            <li key={label}>
              <button onClick={onClickInput(quillRef)} type="button">
                {label}
              </button>
            </li>
          ))}
        </ul>
      )}
    </li>
  );
};

export default Token;
