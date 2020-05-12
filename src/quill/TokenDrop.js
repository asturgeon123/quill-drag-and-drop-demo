import Parchment from "parchment";

import TokenBlot, { TOKEN_BLOT_ID } from "./TokenBlot";

export const TOKEN_MODULE_NAME = "token-drop";

export default class TokenDrop {
  constructor(quill) {
    this.quill = quill;
    this.onDrop = this.onDrop.bind(this);
    this.onClick = this.onClick.bind(this);
    this.quill.root.addEventListener("drop", this.onDrop, false);
    this.quill.root.addEventListener("click", this.onClick, false);
  }

  onDrop(event) {
    const quill = this.quill;
    const tokenData = event.dataTransfer.getData(
      "application/vnd.placeholder.token"
    );

    // If the dropped item is a placeholder token AND a Quill instance is initialized:
    // - Call `preventDefault()` to prevent the token's raw text from being added to the editor.
    // - Use the Quill API to add a token embed into the editor.
    if (tokenData && quill) {
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
      const index = (quill.getSelection() || {}).index || quill.getLength();

      // 1. Insert the placeholder token at the insertion point.
      // 2. Then insert a space.
      // 3. Update the insertion point to be after the token and space.
      quill.insertEmbed(index, TOKEN_BLOT_ID, JSON.parse(tokenData));
      quill.insertText(index + 1, " ");
      quill.setSelection(quill.getSelection().index + 2);
    }
  }

  onClick(event) {
    const token = Parchment.find(event.target);
    if (token instanceof TokenBlot) {
      this.quill.setSelection(token.offset(this.quill.scroll), 1, "user");
    }
  }
}
