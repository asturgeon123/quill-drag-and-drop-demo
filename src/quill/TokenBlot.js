import Quill from "quill";

const Embed = Quill.import("blots/embed");

export default class TokenBlot extends Embed {
  static blotName = "placeholder-token";
  static tagName = "span";
  static className = "token";

  static create({ title, slug, id }) {
    let node = super.create();
    node.textContent = title;
    node.setAttribute("contenteditable", "false");
    node.dataset.title = title;
    node.dataset.slug = slug;
    node.dataset.id = id;
    return node;
  }

  static value(node) {
    return node.dataset;
  }

  length() {
    return 1;
  }
}
