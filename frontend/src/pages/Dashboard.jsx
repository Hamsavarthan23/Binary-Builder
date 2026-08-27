import { useEffect, useState } from "react";
import Card from "../components/Card";
import ProgressBar from "../components/ProgressBar";
import API from "../services/api";

function Dashboard() {
  const [progress, setProgress] = useState([]);

  useEffect(() => {
    const fetchProgress = async () => {
      try {
        const response = await API.get("/progress");

        setProgress(response.data);
      } catch (error) {
        console.error(
          "Error loading progress:",
          error
        );
      }
    };

    fetchProgress();
  }, []);

  const categories = [
    {
      title: "Aptitude",
      description:
        "Practice quantitative and logical aptitude questions.",
      link: "/aptitude"
    },
    {
      title: "Coding",
      description:
        "Practice programming and problem-solving questions.",
      link: "/coding"
    },
    {
      title: "Interview",
      description:
        "Prepare interview questions and complete your checklist.",
      link: "/interview"
    },
    {
      title: "Resources",
      description:
        "Find useful study materials for placement preparation.",
      link: "/resources"
    }
  ];

  const totalCompleted = progress.reduce(
    (sum, item) => sum + item.completed,
    0
  );

  const totalQuestions = progress.reduce(
    (sum, item) => sum + item.total,
    0
  );

  return (
    <div>
      <section className="dashboard-header">
        <h1>Placement Preparation Portal</h1>

        <p>
          Practice, learn, track your progress and
          prepare for your placements.
        </p>
      </section>

      <ProgressBar
        completed={totalCompleted}
        total={totalQuestions}
      />

      <div className="card-grid">
        {categories.map((category) => (
          <Card
            key={category.title}
            title={category.title}
            description={category.description}
            link={category.link}
          />
        ))}
      </div>
    </div>
  );
}

export default Dashboard;