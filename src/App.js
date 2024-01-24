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

// Defined in top level index.html
/* const TOKENS = [
  { title: "first name", slug: "first_name", id: "123" },
  { title: "last name", slug: "last_name", id: "456" },
  { title: "email address", slug: "email", id: "789" }
];
*/

const tokensById = {};
TOKENS.forEach(token => {
  tokensById[token.id] = token;
});

// Defined in top level index.html
//const HTML1 = "{{DEFAULT_HTML}}";
const HTML2 = HTML1;

function App() {
  const quillRef1 = useRef(null);
  const quillRef2 = useRef(null);

  const [html1, setHtml1] = useState(HTML1);
  const [html2, setHtml2] = useState(HTML2);

  const inputs = [
    { label: "Section One", quillRef: quillRef1 },
    { label: "Section Two", quillRef: quillRef2 }
  ];

  const handleSubmit = () => {
    //const submitUrl = "{{SUBMIT_URL}}"; // Placeholder for the URL
    fetch(submitUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ html1, html2 }),
    })
    .then(response => response.json())
    .then(data => console.log(data))
    .catch(error => console.error('Error:', error));
  };

  return (
    <div id="app">
      <div>
        <h1>Tokens</h1>
        <ul className="token-list">
          {TOKENS.map(tokenProps => (
            <Token {...tokenProps} key={tokenProps.id} inputs={inputs} />
          ))}
        </ul>
      </div>
      <section>
        <h1>Editors</h1>
        <p>
          Note: only <strong>bold</strong>, <strong>italic</strong>, and{" "}
          <strong>tokens</strong> are enabled.
        </p>
        <Editor
          value={html1}
          onChange={setHtml1}
          quillRef={quillRef1}
          tokensById={tokensById}
        />
        {/* <Editor
          value={html2}
          onChange={setHtml2}
          quillRef={quillRef2}
          tokensById={tokensById}
        /> */}

        <h1>Outputs</h1>
        <div id="result">
          <p>{html1}</p>
          <p>{html2}</p>
        </div>
        <button onClick={handleSubmit}>Submit</button>
      </section>
      
    </div>
  );
}

export default App;
