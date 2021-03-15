import React, { useState } from "react";
import "./scss/style.scss";

const fetchData = (message: string) => {
  fetch(
    `https://nethergames.de:1763/check?message=${message}&render=true`
  ).then((res) => {
    console.log(res);
  });
};

const App = () => {
  const [textAreaValue, setTextAreaValue] = useState<string>("");
  return (
    <div className="container">
      <div className="container__text">
        <textarea
          value={textAreaValue}
          onChange={(ev: React.ChangeEvent<HTMLTextAreaElement>): void =>
            setTextAreaValue(ev.target.value)
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
        Button
      </div>
    </div>
  );
};

export default App;
