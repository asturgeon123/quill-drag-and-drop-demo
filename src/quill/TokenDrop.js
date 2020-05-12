import Parchment from "parchment";

import TokenBlot from "./TokenBlot";
import insertToken from "./insertToken";

export const TOKEN_MODULE_NAME = "token-drop";

export default class TokenDrop {
  constructor(quill) {
    this.quill = quill;
    this.onDrop = this.onDrop.bind(this);
    this.onClick = this.onClick.bind(this);
    this.onSelectionChange = this.onSelectionChange.bind(this);
    this.quill.root.addEventListener("drop", this.onDrop, false);
    this.quill.root.addEventListener("click", this.onClick, false);
    this.quill.on("selection-change", this.onSelectionChange);
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
      insertToken(quill, JSON.parse(tokenData));
    }
  }

  onClick(event) {
    const token = Parchment.find(event.target);
    if (token instanceof TokenBlot) {
      this.quill.setSelection(token.offset(this.quill.scroll), 1, "user");
    }
  }

  onSelectionChange() {
    const selectedClassName = "selected";
    const selection = window.getSelection();
    const tokens = this.quill.root.querySelectorAll(
      `${TokenBlot.tagName}.${TokenBlot.className}`
    );
    tokens.forEach(node => {
      if (selection.containsNode(node, true)) {
        node.classList.add(selectedClassName);
      } else {
        node.classList.remove(selectedClassName);
      }
    });
  }
}
