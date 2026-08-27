import { useEffect, useState } from "react";

import API from "../services/api";

function Interview() {
  const [questions, setQuestions] =
    useState([]);

  const [loading, setLoading] =
    useState(true);

  useEffect(() => {
    fetchQuestions();
  }, []);

  const fetchQuestions = async () => {
    try {
      const response = await API.get(
        "/interviews"
      );

      setQuestions(response.data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const toggleCompleted = async (question) => {
    try {
      const response = await API.put(
        `/interviews/${question._id}`,
        {
          completed: !question.completed
        }
      );

      setQuestions(
        questions.map((item) =>
          item._id === question._id
            ? response.data
            : item
        )
      );
    } catch (error) {
      console.error(
        "Error updating interview:",
        error
      );
    }
  };

  if (loading) {
    return <h2>Loading interview questions...</h2>;
  }

  return (
    <div>
      <h1>Interview Checklist</h1>

      <p>
        Complete each item after preparing the
        question.
      </p>

      {questions.length === 0 ? (
        <p>No interview questions available.</p>
      ) : (
        questions.map((question) => (
          <div
            className="interview-item"
            key={question._id}
          >
            <input
              type="checkbox"
              checked={question.completed}
              onChange={() =>
                toggleCompleted(question)
              }
            />

            <span
              className={
                question.completed
                  ? "completed"
                  : ""
              }
            >
              {question.question}
            </span>

            <small>
              {question.category}
            </small>
          </div>
        ))
      )}
    </div>
  );
}

export default Interview;