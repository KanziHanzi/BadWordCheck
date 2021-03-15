import React, { useState } from "react";
import "./scss/style.scss";

const fetchData = (message: string) => {
  const http = new XMLHttpRequest();
  const url = `https://nethergames.de:1763/check?message=${message}&render=true`;
  const outputEl = document.querySelector('.container__output');
  http.open("GET", url);
  http.send();
  http.onreadystatechange = (e) => {
    outputEl!.innerHTML = http.responseText;
  }
};

const App = () => {
  const [textAreaValue, setTextAreaValue] = useState<string>("");
  return (
    <div className="container">
      <div className="container__text">
        <textarea
          value={textAreaValue}
          onChange={(event: React.ChangeEvent<HTMLTextAreaElement>): void =>
            setTextAreaValue(event.currentTarget.value)
          }
          className="container__input"
        />
      </div>
      <div
        onClick={() => {
          fetchData(textAreaValue);
        }}
        className="container__button"
      >
        Check String
      </div>
      <div
        className="container__output"
      />
    </div>
  );
};

export default App;
