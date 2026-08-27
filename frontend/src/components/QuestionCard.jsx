import { useState } from "react";

function QuestionCard({ question }) {
  const [selectedAnswer, setSelectedAnswer] =
    useState("");

  const [showAnswer, setShowAnswer] =
    useState(false);

  const handleSubmit = () => {
    if (selectedAnswer === "") {
      alert("Please select an answer");
      return;
    }

    setShowAnswer(true);
  };

  return (
    <div className="question-card">
      <h3>{question.title}</h3>

      <p className="question-text">
        {question.question}
      </p>

      {question.options &&
        question.options.length > 0 && (
          <div className="options">
            {question.options.map(
              (option, index) => (
                <label
                  key={index}
                  className="option"
                >
                  <input
                    type="radio"
                    name={question._id}
                    value={option}
                    onChange={(e) =>
                      setSelectedAnswer(
                        e.target.value
                      )
                    }
                  />

                  {option}
                </label>
              )
            )}
          </div>
        )}

      <button onClick={handleSubmit}>
        Submit Answer
      </button>

      {showAnswer && (
        <div className="answer">
          {selectedAnswer === question.answer
            ? "Correct Answer!"
            : `Wrong Answer! Correct answer: ${question.answer}`}
        </div>
      )}
    </div>
  );
}

export default QuestionCard;