import { useEffect, useState } from "react";

import API from "../services/api";
import SearchBar from "../components/SearchBar";

function Coding() {
  const [questions, setQuestions] =
    useState([]);

  const [search, setSearch] =
    useState("");

  const [loading, setLoading] =
    useState(true);

  useEffect(() => {
    const fetchCodingQuestions = async () => {
      try {
        const response = await API.get(
          "/questions?category=Coding"
        );

        setQuestions(response.data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchCodingQuestions();
  }, []);

  const filteredQuestions =
    questions.filter((question) =>
      question.title
        .toLowerCase()
        .includes(search.toLowerCase()) ||
      question.topic
        .toLowerCase()
        .includes(search.toLowerCase())
    );

  return (
    <div>
      <h1>Coding Preparation</h1>

      <SearchBar
        search={search}
        setSearch={setSearch}
      />

      {loading ? (
        <h2>Loading coding questions...</h2>
      ) : filteredQuestions.length === 0 ? (
        <p>No coding questions found.</p>
      ) : (
        filteredQuestions.map((question) => (
          <div
            className="question-card"
            key={question._id}
          >
            <h2>{question.title}</h2>

            <p>{question.question}</p>

            <p>
              <strong>Topic:</strong>{" "}
              {question.topic}
            </p>

            <p>
              <strong>Difficulty:</strong>{" "}
              {question.difficulty}
            </p>
          </div>
        ))
      )}
    </div>
  );
}

export default Coding;