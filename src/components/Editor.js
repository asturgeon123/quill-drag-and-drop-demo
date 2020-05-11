import React, { useState } from "react";
import Quill from "quill";
import TokenBlot from "../blots/TokenBlot";
import "quill/dist/quill.snow.css";

Quill.register(TokenBlot);

const CONFIG = {
  formats: ["bold", "italic", "placeholder-token"],
  modules: {
    toolbar: [["bold", "italic"]]
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

  const onDrop = event => {
    const tokenData = event.dataTransfer.getData(
      "application/vnd.placeholder.token"
    );

    // If the dropped item is a placeholder token AND a Quill instance is initialized:
    // - Call `preventDefault()` to prevent the token's raw text from being added to the editor.
    // - Use the Quill API to add a token embed into the editor.
    if (tokenData && editor) {
      event.preventDefault();

      // Get the index of the native insertion point.
      // Drag events do not update Quill's selection so it must be calculated manually.
      // Cribbed from: https://github.com/kensnyder/quill-image-drop-module
      if (document.caretRangeFromPoint) {
        const selection = document.getSelection();
        const range = document.caretRangeFromPoint(
          event.clientX,
          event.clientY
        );
        if (selection && range) {
          selection.setBaseAndExtent(
            range.startContainer,
            range.startOffset,
            range.startContainer,
            range.startOffset
          );
        }
      }
      const index = (editor.getSelection() || {}).index || editor.getLength();

      // 1. Insert the placeholder token at the insertion point.
      // 2. Then insert a space.
      // 3. Update the insertion point to be after the token and space.
      editor.insertEmbed(index, "placeholder-token", JSON.parse(tokenData));
      editor.insertText(index + 1, " ");
      editor.setSelection(editor.getSelection().index + 2);
    }
  };

  return <div ref={onMount} onDrop={onDrop} style={{ height: 200 }} />;
};

export default Editor;
