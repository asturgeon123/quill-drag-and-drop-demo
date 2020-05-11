import React, { useState } from "react";
import Token from "./components/Token";
import Editor from "./components/Editor";

import Quill from "quill";
import TokenBlot from "./quill/TokenBlot";
import TokenDrop, { TOKEN_MODULE_NAME } from "./quill/TokenDrop";
import "quill/dist/quill.snow.css";

// Regisger the token embed and the drap-drop module with the Quill library,
// so that they are available to any Quill instance.
Quill.register(TokenBlot);
Quill.register(`modules/${TOKEN_MODULE_NAME}`, TokenDrop);

function App() {
  const [html, setHtml] = useState(
    "<p>The <strong>quick brown fox</strong> jumps over the <em>lazy dog</em>.</p>"
  );
  return (
    <div id="app">
      <aside>
        <h1>Tokens</h1>
        <ul className="token-list">
          <li>
            <Token title="first name" slug="first_name" id="123" />
          </li>
          <li>
            <Token title="last name" slug="last_name" id="456" />
          </li>
          <li>
            <Token title="email address" slug="email" id="789" />
          </li>
        </ul>
      </aside>
      <section>
        <h1>Editor</h1>
        <p>
          Note: only <strong>bold</strong>, <strong>italic</strong>, and{" "}
          <strong>tokens</strong> are enabled.
        </p>
        <Editor value={html} onChange={setHtml} />
        <h1>Output</h1>
        <div id="result">{html}</div>
      </section>
    </div>
  );
}

export default App;
