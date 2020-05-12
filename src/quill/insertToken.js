import TokenBlot from "./TokenBlot";

const insertToken = (quill, tokenData) => {
  const index = (quill.getSelection() || {}).index || quill.getLength() || 0;
  quill.insertEmbed(index, TokenBlot.blotName, tokenData);
  quill.insertText(index + 1, " ");
  quill.setSelection(index + 2);
};

export default insertToken;
