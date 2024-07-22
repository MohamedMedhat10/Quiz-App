import React, { createContext, useEffect, useState } from "react";
import "./App.css";
import { QuizSettings } from "./QuizSettings";
import $ from "jquery";

// Context for managing quiz settings visibility
export const ShowQuizSetting = createContext([true, () => {}]);

// Interfaces for question and answered question structures
interface Question {
  category: string;
  type: string;
  difficulty: string;
  question: string;
  correct_answer: string;
  incorrect_answers: string[];
  answers: string[];
}

interface AnsweredQuestions {
  questionId: number;
  questionResult: string;
  answeredQuestionId: number;
}

export const Quiz = () => {
  const [settings, setSettings] = useState(true);
  const [quiz, setQuiz] = useState<Question[]>([]);
  const [correctAnswers, setCorrectAnswers] = useState<number>(0);
  const [answeredQuestions, setAnsweredQuestions] = useState<
    AnsweredQuestions[]
  >([]);
  const [finished, setFinished] = useState<boolean>(false);

  // Current question index
  let [current, setCurrent] = useState<number>(0);

  // Clean and shuffle questions and answers
  const handleQuestions = (QuestionsAndAnswers) => {
    const cleanedQuiz = QuestionsAndAnswers.map((q) => ({
      ...q,
      question: cleanText(q.question),
      category: cleanText(q.category),
      answers: shuffleAnswers(q),
    }));
    setQuiz(cleanedQuiz);
  };

  // UseEffect to handle question state on change
  useEffect(() => {
    const answered = answeredQuestions.find((q) => q.questionId === current);
    if (answered) {
      $(`#answers button#${answered.answeredQuestionId}`).addClass(
        answered.questionResult === "correct" ? "correctEffect" : "falseEffect"
      );
      $(".correct").addClass("correctEffect");
      $("#answers").children().prop("disabled", true).css("cursor", "default");
    }
  }, [current, answeredQuestions]);

  // Clean HTML entities from text
  const cleanText = (text) => {
    const parser = new DOMParser();
    const decodedString =
      parser.parseFromString(text, "text/html").body.textContent || "";
    return decodedString;
  };

  // Shuffle answers for randomness
  const shuffleAnswers = (question) => {
    const allAnswers = [...question.incorrect_answers, question.correct_answer];
    return allAnswers.sort(() => Math.random() - 0.5);
  };

  // Check answer and update state
  const CheckAnswer = (e, index) => {
    const isCorrect = e.target.classList.contains("correct");
    if (isCorrect) {
      setCorrectAnswers((correctAnswers) => correctAnswers + 1);
    }
    let questionAnswer: AnsweredQuestions = {
      questionId: current,
      questionResult: isCorrect ? "correct" : "false",
      answeredQuestionId: index,
    };
    setAnsweredQuestions((prev) => {
      const updatedAnswers = prev.filter((q) => q.questionId !== current);
      return [...updatedAnswers, questionAnswer];
    });
  };

  // Finalize quiz results
  const getResults = () => {
    setFinished(true);
  };

  const tryAgain = () => {
    setFinished(true);
    setQuiz([]);
    setCorrectAnswers(0);
    setAnsweredQuestions([]);
    setFinished(false);
    setCurrent(0);
    setSettings(true);
  };

  // Navigate between questions
  const questionsNavigation = (navigate: string) => {
    if (navigate === "next") {
      setCurrent((current) => current + 1);
    } else {
      setCurrent((current) => current - 1);
    }
  };

  return (
    <div className="quizContainer w-50 rounded m-auto d-flex flex-column justify-content-center">
      <ShowQuizSetting.Provider value={[settings, setSettings]}>
        {settings ? (
          <QuizSettings onSubmit={handleQuestions} />
        ) : quiz.length > 0 && !finished ? (
          <>
            <div className="quizInfo pe-5 ps-5 mt-3">
              <p className="mb-0">
                <span className="questionCurrent">
                  Question {current + 1}/{" "}
                </span>
                <span
                  style={{
                    opacity: ".5",
                    fontFamily: "math",
                    fontSize: "20px",
                  }}
                >
                  {quiz.length}
                </span>
              </p>
              <p
                style={{
                  fontFamily: "math",
                  fontSize: "20px",
                  lineHeight: "43px",
                }}
                className="mb-0"
              >
                Category : {quiz[current].category}
              </p>
            </div>
            <hr></hr>
            <div className="d-flex flex-column questionsAndanswers">
              {quiz.map((q, i) => {
                if (i === current) {
                  const answers = q.answers;
                  return (
                    <React.Fragment key={i}>
                      <div className="question mb-0">
                        <p className="mb-0">{q.question}</p>
                      </div>
                      <div className="answers" id="answers">
                        {answers.map((answer, index) => (
                          <button
                            key={index}
                            className={
                              answer === q.correct_answer ? "correct" : "false"
                            }
                            id={(index + 1).toString()}
                            style={{ width: "50%" }}
                            onClick={(e) => CheckAnswer(e, index + 1)}
                            // Disable button if question has been answered
                            disabled={answeredQuestions.some(
                              (aq) => aq.questionId === current
                            )}
                          >
                            {answer}
                          </button>
                        ))}
                      </div>
                    </React.Fragment>
                  );
                }
                return null;
              })}
            </div>
          </>
        ) : (
          quiz.length > 0 && (
            <>
              <div>
                <h2>{((correctAnswers / quiz.length) * 100).toFixed(2)}%</h2>{" "}
                You Scored {correctAnswers} out of {quiz.length}
              </div>
              <div>
                <button
                  className="btn btn-success mb-3 mt-3 w-25 m-auto"
                  onClick={() => tryAgain()}
                >
                  Start A New Quiz
                </button>
              </div>
            </>
          )
        )}
      </ShowQuizSetting.Provider>
      <div className="d-flex">
        {current !== 0 && !finished && !settings && (
          <button
            className="btn btn-info mb-3 mt-3 w-25 m-auto"
            onClick={() => questionsNavigation("previous")}
          >
            Previous
          </button>
        )}

        {current !== quiz.length - 1 &&
        !finished &&
        !settings &&
        quiz.length > 0 ? (
          <button
            className="btn btn-success mb-3 mt-3 w-25 m-auto"
            onClick={() => questionsNavigation("next")}
          >
            Next
          </button>
        ) : (
          current === quiz.length - 1 &&
          !finished &&
          !settings && (
            <button
              className="btn btn-primary mb-3 mt-3 w-25 m-auto"
              onClick={getResults}
            >
              Submit
            </button>
          )
        )}
      </div>
    </div>
  );
};
