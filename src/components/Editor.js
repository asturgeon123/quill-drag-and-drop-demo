import React, { useState } from "react";
import Quill from "quill";
import TokenBlot from "../quill/TokenBlot";
import { TOKEN_MODULE_NAME } from "../quill/TokenDrop";

const CONFIG = {
  formats: ["bold", "italic", TokenBlot.blotName],
  modules: {
    toolbar: [["bold", "italic"]],
    [TOKEN_MODULE_NAME]: true
  },
  theme: "snow"
};

const TOKEN_MATCHER = /\{\{(\w*)\|(\w*)\}\}/gi;

// Replace the token embeds from the Quill output with placeholder syntax.
const htmlToTokens = htmlString => {
  const parser = new DOMParser();
  const dom = parser.parseFromString(htmlString, "text/html");
  dom.querySelectorAll(`.${TokenBlot.className}`).forEach(token => {
    const {
      dataset: { id, slug }
    } = token;
    token.replaceWith(`{{${slug}|${id}}}`);
  });
  return dom.body.innerHTML;
};

const tokensToHtml = (tokenizedString, tokensById) => {
  return tokenizedString.replace(TOKEN_MATCHER, (match, slug, id) => {
    const token = tokensById[id];
    // Ignore matches that aren't for a real token.
    if (!token) {
      return match;
    }
    const { title } = token;
    return `<${TokenBlot.tagName} class="${TokenBlot.className}" contenteditable="false" data-title="${title}" data-slug="${slug}" data-id="${id}">${title}</${TokenBlot.tagName}>`;
  });
};

const Editor = ({ value, onChange, quillRef, tokensById }) => {
  const [editor, setEditor] = useState(null);

  const onValueChange = html => onChange(htmlToTokens(html));

  // When the containing div is mounted, initialize the Quill instance.
  // Don't mount if an instance already exists!
  const onMount = container => {
    if (!editor && container) {
      // Set the innerHTML once so that Quill is initialized with the starting value.
      container.innerHTML = tokensToHtml(value, tokensById);
      const quill = new Quill(container, CONFIG);
      quill.on("text-change", () => onValueChange(quill.root.innerHTML));
      setEditor(quill);
      quillRef.current = quill;
    }
  };

  return <div ref={onMount} style={{ height: 200 }} />;
};

export default Editor;
