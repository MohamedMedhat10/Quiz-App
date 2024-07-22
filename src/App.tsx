import React, { createContext, useContext, useState } from "react";
import "./App.css";
import { QuizSettings } from "./QuizSettings";

export const showQuizSetting = React.createContext<boolean>(true);

interface QuestionStructure {}

function App() {
  const [settings, Setsettings] = useState(true);
  const [quizUrl, setQuizUrl] = useState("");
  const [Questions, setQuestions] = useState([]);

  const handleQuizUrl = (url) => {
    setQuizUrl(url);
  };

  const fetchQuiz = async () => {
    const QuestionsResponse = await fetch(quizUrl);
    const jsonQuestionsResponse = await QuestionsResponse.json();
  };

  return (
    <>
      <div className="quizContainer w-50 rounded m-auto d-flex justify-content-center">
        <showQuizSetting.Provider value={[settings, Setsettings]}>
          {settings ? (
            <QuizSettings onSubmit={handleQuizUrl}></QuizSettings>
          ) : (
            <button onClick={fetchQuiz}>Show</button>
          )}
        </showQuizSetting.Provider>
      </div>
    </>
  );
}

export default App;
