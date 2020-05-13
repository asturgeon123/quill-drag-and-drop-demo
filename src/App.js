import React, { useState, useRef } from "react";
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
  const quillRef1 = useRef(null);
  const quillRef2 = useRef(null);

  const inputs = [
    { label: "Section One", quillRef: quillRef1 },
    { label: "Section Two", quillRef: quillRef2 }
  ];

  const [html1, setHtml1] = useState(
    "<p>The <strong>quick brown fox</strong> jumps over the <em>lazy dog</em>.</p>"
  );

  const [html2, setHtml2] = useState(
    "<p>Sphinx of <strong>black quartz</strong>, judge my <em>vow</em>.</p>"
  );

  return (
    <div id="app">
      <aside>
        <h1>Tokens</h1>
        <ul className="token-list">
          <Token
            title="first name"
            slug="first_name"
            id="123"
            inputs={inputs}
          />
          <Token title="last name" slug="last_name" id="456" inputs={inputs} />
          <Token title="email address" slug="email" id="789" inputs={inputs} />
        </ul>
      </aside>
      <section>
        <h1>Editors</h1>
        <p>
          Note: only <strong>bold</strong>, <strong>italic</strong>, and{" "}
          <strong>tokens</strong> are enabled.
        </p>
        <Editor value={html1} onChange={setHtml1} quillRef={quillRef1} />
        <Editor value={html2} onChange={setHtml2} quillRef={quillRef2} />
        <h1>Outputs</h1>
        <div id="result">
          <p>{html1}</p>
          <p>{html2}</p>
        </div>
      </section>
    </div>
  );
}

export default App;
