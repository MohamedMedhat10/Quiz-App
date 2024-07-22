import React, { useContext, useState } from "react";
import { ShowQuizSetting } from "./Quiz";

interface Question {
  category: string;
  type: string;
  difficulty: string;
  question: string;
  correct_answer: string;
  incorrect_answers: string[];
}

interface QuizResponse {
  results: Question[];
}

export const QuizSettings = ({ onSubmit }) => {
  const [_, setShowSetting] = useContext(ShowQuizSetting);
  const [settings, setSettings] = useState({
    amount: 1,
    category: "any",
    difficulty: "any",
    type: "any",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setSettings((prevSettings) => ({
      ...prevSettings,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    let baseUrl = `https://opentdb.com/api.php?amount=${settings.amount}`;
    if (settings.category !== "any") {
      baseUrl += `&category=${settings.category}`;
    }
    if (settings.type !== "any") {
      baseUrl += `&type=${settings.type}`;
    }
    if (settings.difficulty !== "any") {
      baseUrl += `&difficulty=${settings.difficulty}`;
    }

    setShowSetting(false);
    fetchQuiz(baseUrl);
  };

  const fetchQuiz = async (url: string) => {
    const questionsResponse = await fetch(url);
    const jsonQuestionsResponse: QuizResponse = await questionsResponse.json();
    onSubmit(jsonQuestionsResponse.results);
  };
  return (
    <div>
      <h2 className="mt-4 mb-5">
        <u>Welcome To My Quiz Application</u>
      </h2>
      <form
        onSubmit={handleSubmit}
        className="d-flex flex-column align-items-center"
      >
        <header className="mb-3">
          <u>Select Quiz Settings</u>
        </header>
        <div className="input-group mb-4 w-50">
          <div className="input-group-prepend w-50">
            <span className="input-group-text" id="inputGroup-sizing-default">
              Number of questions
            </span>
          </div>
          <input
            name="amount"
            type="number"
            max={50}
            min={1}
            onChange={handleChange}
            defaultValue={1}
            className="form-control"
            aria-label="Default"
            aria-describedby="inputGroup-sizing-default"
          />
        </div>
        <div className="input-group mb-4 w-50">
          <div className="input-group-prepend w-50">
            <span className="input-group-text" id="inputGroup-sizing-default">
              Select Category
            </span>
          </div>
          <select
            name="category"
            onChange={handleChange}
            className="form-control"
          >
            <option value="any">Any Category</option>
            <option value="9">General Knowledge</option>
            <option value="10">Entertainment: Books</option>
            <option value="11">Entertainment: Film</option>
            <option value="12">Entertainment: Music</option>
            <option value="13">Entertainment: Musicals &amp; Theatres</option>
            <option value="14">Entertainment: Television</option>
            <option value="15">Entertainment: Video Games</option>
            <option value="16">Entertainment: Board Games</option>
            <option value="17">Science &amp; Nature</option>
            <option value="18">Science: Computers</option>
            <option value="19">Science: Mathematics</option>
            <option value="20">Mythology</option>
            <option value="21">Sports</option>
            <option value="22">Geography</option>
            <option value="23">History</option>
            <option value="24">Politics</option>
            <option value="25">Art</option>
            <option value="26">Celebrities</option>
            <option value="27">Animals</option>
            <option value="28">Vehicles</option>
            <option value="29">Entertainment: Comics</option>
            <option value="30">Science: Gadgets</option>
            <option value="31">
              Entertainment: Japanese Anime &amp; Manga
            </option>
            <option value="32">Entertainment: Cartoon &amp; Animations</option>
          </select>
        </div>
        <div className="input-group mb-4 w-50">
          <div className="input-group-prepend w-50">
            <span className="input-group-text" id="inputGroup-sizing-default">
              Select Difficulty
            </span>
          </div>
          <select
            name="difficulty"
            onChange={handleChange}
            className="form-control"
          >
            <option value="any">Any Difficulty</option>
            <option value="easy">Easy</option>
            <option value="medium">Medium</option>
            <option value="hard">Hard</option>
          </select>
        </div>
        <div className="input-group mb-4 w-50">
          <div className="input-group-prepend w-50">
            <span className="input-group-text" id="inputGroup-sizing-default">
              Select Type
            </span>
          </div>
          <select name="type" onChange={handleChange} className="form-control">
            <option value="any">Any Type</option>
            <option value="multiple">Multiple Choice</option>
            <option value="boolean">True / False</option>
          </select>
        </div>

        <button className="btn btn-primary mt-5 w-50 mb-4">Start Quiz</button>
      </form>
    </div>
  );
};
