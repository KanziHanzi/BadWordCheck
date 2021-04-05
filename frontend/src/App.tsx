import React, { useState } from "react";
import "./scss/style.scss";

const outputEl = React.createRef<HTMLDivElement>();

const fetchData = (message: string) => {
  const http = new XMLHttpRequest();
  const url = `https://nethergames.de:1763/check?message=${message}&render=true`;
  http.open("GET", url);
  http.send();
  http.onreadystatechange = () => {
    outputEl.current!.innerHTML = http.responseText;
  };
};

const showErrorMessage = (error: string) => {
  outputEl.current!.innerHTML = error;
};

const App = () => {
  const [textAreaValue, setTextAreaValue] = useState<string>("");
  return (
    <div className="wordcheck">
      <div className="wordcheck__container">
        <textarea
          placeholder="Hier Text eingeben"
          value={textAreaValue}
          onChange={(event: React.ChangeEvent<HTMLTextAreaElement>): void =>
            setTextAreaValue(event.currentTarget.value)
          }
          className="wordcheck__textarea"
        />
        <button
          onClick={() => {
            textAreaValue !== ""
              ? fetchData(textAreaValue)
              : showErrorMessage("Bitte füge einen Text ein");
          }}
          className="wordcheck__button"
        >
          Check String
        </button>
        <div className="wordcheck__output" ref={outputEl} />
      </div>
    </div>
  );
};

export default App;
