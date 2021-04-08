import React, { useState } from "react";
import "./scss/style.scss";
import { scoreColors } from './utils/scoreColors.js';

const fetchData = (message: string) => {
  const http = new XMLHttpRequest();
  const url = `https://nethergames.de:1763/check?message=${message}&render=true`;
  http.open("GET", url);
  http.send();
  http.onreadystatechange = () => {
    outputEl.current!.innerHTML = http.responseText;
    if (http.readyState == 4) {
      listBadWords();
      badWordScore(listBadWords());
    }
  };
};

const showErrorMessage = (error: string) => {
  outputEl.current!.innerHTML = error;
};

const listBadWords = () => {
  const badWordNodes = document.getElementsByTagName("b");
  const badWordArr = [];
  let i: number = 0;
  for (i; i < badWordNodes.length; i++) {
    badWordArr.push(badWordNodes[i].innerHTML);
  }
  return badWordArr;
};

const badWordScore = (badWords: any) => {
  const allWords = outputEl.current!.innerText;
  const allWordsArray = allWords.split(/\s+/);
  const badWordsCount = badWords.length;
  const allWordsCount = allWordsArray.length;

  const score = badWordsCount / allWordsCount;
  const trimmedScore = Math.round(score*100)/100;
  const formattedScore = trimmedScore * 100 + '%'

  switch (trimmedScore !== undefined && trimmedScore !== null) {
    case trimmedScore === 0:
      scoreEl.current!.style.borderColor = scoreColors.perfect;
      break;
    case trimmedScore > 0 && trimmedScore <= 0.2:
      console.log('light');
      scoreEl.current!.style.borderColor = scoreColors.light;
      break;
    case trimmedScore > 0.2 && trimmedScore <= 0.4:
      console.log('medium');
      scoreEl.current!.style.borderColor = scoreColors.medium;
      break;
    case trimmedScore > 0.4 && trimmedScore <= 0.6:
      console.log('high');
      scoreEl.current!.style.borderColor = scoreColors.high;
      break;
    case trimmedScore > 0.6 && trimmedScore <= 0.8:
      console.log('veryHigh');
      scoreEl.current!.style.borderColor = scoreColors.veryHigh;
      break;
    case trimmedScore > 0.8 && trimmedScore < 1:
      console.log('extreme');
      scoreEl.current!.style.borderColor = scoreColors.extreme;
      break;
    case trimmedScore === 1:
      console.log('not safe for work');
      scoreEl.current!.style.borderColor = scoreColors.notSafeForWork;
      break;
    }
  scoreEl.current!.innerHTML = formattedScore;
};

const outputEl = React.createRef<HTMLDivElement>();
const scoreEl = React.createRef<HTMLDivElement>();

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
          onClick={async () => {
            textAreaValue !== ""
              ? fetchData(textAreaValue)
              : showErrorMessage("Bitte füge einen Text ein");
          }}
          className="wordcheck__button"
        >
          Check String
        </button>
        <div className="wordcheck__output" ref={outputEl} />
        <div className="wordcheck__score" ref={scoreEl} />
      </div>
    </div>
  );
};

export default App;
