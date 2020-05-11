import React, { useState } from "react";
import Quill from "quill";
import { TOKEN_BLOT_ID } from "../quill/TokenBlot";
import { TOKEN_MODULE_NAME } from "../quill/TokenDrop";

const CONFIG = {
  formats: ["bold", "italic", TOKEN_BLOT_ID],
  modules: {
    toolbar: [["bold", "italic"]],
    [TOKEN_MODULE_NAME]: true
  },
  theme: "snow"
};

const Editor = ({ value, onChange }) => {
  const [editor, setEditor] = useState(null);

  // Replace the token nodes with placeholder syntax text.
  // In a production app this should only be done once when submitting
  // instead of after every text change.
  const onValueChange = html => {
    const parser = new DOMParser();
    const dom = parser.parseFromString(html, "text/html");
    dom.querySelectorAll(".token").forEach(token => {
      const {
        dataset: { id, slug }
      } = token;
      token.replaceWith(`{{${slug}|${id}}}`);
    });
    onChange(dom.body.innerHTML);
  };

  // When the containing div is mounted, initialize the Quill instance.
  // Don't mount if an instance already exists!
  const onMount = container => {
    if (!editor && container) {
      // Set the innerHTML once so that Quill is initialized with the starting value.
      container.innerHTML = value;
      const quill = new Quill(container, CONFIG);
      quill.on("text-change", () => onValueChange(quill.root.innerHTML));
      setEditor(quill);
    }
  };

  return <div ref={onMount} style={{ height: 200 }} />;
};

export default Editor;
