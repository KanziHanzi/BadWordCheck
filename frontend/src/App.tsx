import React, { ReactNode } from "react";
import "./scss/style.scss";
import { scoreColors } from "./utils/scoreColors.js";

const fetchData = (message: string) => {
  const http = new XMLHttpRequest();
  const url = `https://nethergames.de:1763/check?message=${message}&render=true`;
  http.open("GET", url);
  http.send();
  http.onreadystatechange = () => {
    outputEl.current!.innerHTML = http.responseText;
    if (http.readyState === 4) {
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
  const trimmedScore = Math.round(score * 100) / 100;
  const formattedScore = trimmedScore * 100 + "%";

  switch (allWords !== "") {
    case trimmedScore === 0:
      scoreEl.current!.style.borderColor = scoreColors.perfect;
      break;
    case trimmedScore > 0 && trimmedScore <= 0.2:
      scoreEl.current!.style.borderColor = scoreColors.light;
      break;
    case trimmedScore > 0.2 && trimmedScore <= 0.4:
      scoreEl.current!.style.borderColor = scoreColors.medium;
      break;
    case trimmedScore > 0.4 && trimmedScore <= 0.6:
      scoreEl.current!.style.borderColor = scoreColors.high;
      break;
    case trimmedScore > 0.6 && trimmedScore <= 0.8:
      scoreEl.current!.style.borderColor = scoreColors.veryHigh;
      break;
    case trimmedScore > 0.8 && trimmedScore < 1:
      scoreEl.current!.style.borderColor = scoreColors.extreme;
      break;
    case trimmedScore === 1:
      scoreEl.current!.style.borderColor = scoreColors.notSafeForWork;
      break;
  }
  scoreEl.current!.innerHTML = formattedScore;
};

const outputEl = React.createRef<HTMLDivElement>();
const scoreEl = React.createRef<HTMLDivElement>();

class App extends React.Component<{}, { textAreaValue: string }> {
  constructor(props: any) {
    super(props);
    this.state = { textAreaValue: "" };
    this.handleInput = this.handleInput.bind(this);
  }

  handleInput(event: any) {
    this.setState(() => {
      return { textAreaValue: (event.target as HTMLTextAreaElement).value };
    });
  }

  render(): ReactNode {
    return (
      <div className="wordcheck">
        <div className="wordcheck__container">
          <textarea
            placeholder="Hier Text eingeben"
            onKeyPress={() => console.log("test")}
            value={this.state.textAreaValue}
            onChange={this.handleInput}
            className="wordcheck__textarea"
          />
          <button
            onClick={async () => {
              this.state.textAreaValue !== ""
                ? fetchData(this.state.textAreaValue)
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
  }
}

export default App;
