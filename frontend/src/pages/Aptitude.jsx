import { useEffect, useState } from "react";

import API from "../services/api";
import QuestionCard from "../components/QuestionCard";
import SearchBar from "../components/SearchBar";

function Aptitude() {
  const [questions, setQuestions] =
    useState([]);

  const [search, setSearch] =
    useState("");

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");

  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        const response = await API.get(
          "/questions?category=Aptitude"
        );

        setQuestions(response.data);
      } catch (error) {
        setError(
          "Unable to load aptitude questions."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchQuestions();
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

  if (loading) {
    return <h2>Loading questions...</h2>;
  }

  if (error) {
    return <h2>{error}</h2>;
  }

  return (
    <div>
      <h1>Aptitude Preparation</h1>

      <SearchBar
        search={search}
        setSearch={setSearch}
      />

      {filteredQuestions.length === 0 ? (
        <p>No aptitude questions found.</p>
      ) : (
        filteredQuestions.map((question) => (
          <QuestionCard
            key={question._id}
            question={question}
          />
        ))
      )}
    </div>
  );
}

export default Aptitude;