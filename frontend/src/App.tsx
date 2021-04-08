import React from "react";
import "./scss/style.scss";
import { scoreColors } from "./utils/scoreColors.js";

const outputEl = React.createRef<HTMLDivElement>();
const scoreEl = React.createRef<HTMLDivElement>();

class TextData {
  static fetchData(message: string) {
    const http = new XMLHttpRequest();
    const url = `https://nethergames.de:1763/check?message=${message}&render=true`;
    http.open("GET", url);
    http.send();
    http.onreadystatechange = () => {
      outputEl.current!.innerHTML = http.responseText;
      if (http.readyState === 4) {
        TextData.listBadWords();
        BadWordScore.createScore(TextData.listBadWords());
      }
    };
  }

  static showErrorMessage(error: string) {
    outputEl.current!.innerHTML = error;
  };

  static listBadWords() {
    const badWordNodes = document.getElementsByTagName("b");
    const badWordArr = [];
    let i: number = 0;
    for (i; i < badWordNodes.length; i++) {
      badWordArr.push(badWordNodes[i].innerHTML);
    }
    return badWordArr;
  };
}


class BadWordScore extends React.Component {
  static trimmedScore: number;
  static formattedScore: string;
  static score: number;
  static allWordsCount: number;
  static allWordsArray: string[];
  static allWords: string;
  static badWordsCount: number;

   static createScore(el: string[]) {
     console.log(el)
    this.allWords = outputEl.current!.innerText;
    this.allWordsArray = this.allWords.split(/\s+/);
    this.allWordsCount = this.allWordsArray.length;
    this.score = el.length / this.allWordsCount;
    BadWordScore.trimScore();
    BadWordScore.formatScore();
    BadWordScore.colorCodeScore();
  }

  static trimScore() {
    BadWordScore.trimmedScore = Math.round(BadWordScore.score * 100) / 100;
  }

  static formatScore() {
    BadWordScore.formattedScore = BadWordScore.trimmedScore * 100 + "%";
  }

  static colorCodeScore() {
    switch (BadWordScore.allWords !== "") {
      case BadWordScore.trimmedScore === 0:
        scoreEl.current!.style.borderColor = scoreColors.perfect;
        break;
      case BadWordScore.trimmedScore > 0 && BadWordScore.trimmedScore <= 0.2:
        scoreEl.current!.style.borderColor = scoreColors.light;
        break;
      case BadWordScore.trimmedScore > 0.2 && BadWordScore.trimmedScore <= 0.4:
        scoreEl.current!.style.borderColor = scoreColors.medium;
        break;
      case BadWordScore.trimmedScore > 0.4 && BadWordScore.trimmedScore <= 0.6:
        scoreEl.current!.style.borderColor = scoreColors.high;
        break;
      case BadWordScore.trimmedScore > 0.6 && BadWordScore.trimmedScore <= 0.8:
        scoreEl.current!.style.borderColor = scoreColors.veryHigh;
        break;
      case BadWordScore.trimmedScore > 0.8 && BadWordScore.trimmedScore < 1:
        scoreEl.current!.style.borderColor = scoreColors.extreme;
        break;
      case BadWordScore.trimmedScore === 1:
        scoreEl.current!.style.borderColor = scoreColors.notSafeForWork;
        break;
    }
    scoreEl.current!.innerHTML = BadWordScore.formattedScore;
  }

  render() {
    return (
      <div className="wordcheck__score" ref={scoreEl} />
    )
  }
};

class Container extends React.Component<{}, { textAreaValue: string }> {
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

  render() {
    return (
      <div className="wordcheck__container">
        <textarea
          placeholder="Hier Text eingeben"
          value={this.state.textAreaValue}
          onChange={this.handleInput}
          className="wordcheck__textarea"
        />
        <button
          onClick={async () => {
            this.state.textAreaValue !== ""
              ? TextData.fetchData(this.state.textAreaValue)
              : TextData.showErrorMessage("Bitte füge einen Text ein");
          }}
          className="wordcheck__button"
        >
          Check String
        </button>
        <div className="wordcheck__output" ref={outputEl} />
        <BadWordScore />
      </div>
    )
  }
}

class App extends React.Component {
  render() {
    return (
      <div className="wordcheck">
        <Container />
      </div>
    );
  }
}

export default App;
