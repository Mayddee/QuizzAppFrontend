import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import './styles/QuizDetailPage.css';

const QuizDetailPage = () => {
  const { quizId } = useParams();
  const navigate = useNavigate();
  const [quiz, setQuiz] = useState(null);
  const [questionCount, setQuestionCount] = useState(0);

  useEffect(() => {
    const fetchQuiz = async () => {
      const res = await fetch(`http://localhost:8000/quiz/${quizId}`, {
        credentials: 'include'
      });
      const data = await res.json();
      setQuiz(data);
    };

    const fetchQuestions = async () => {
      const res = await fetch(`http://localhost:8000/quiz/${quizId}/questions`, {
        credentials: 'include'
      });
      const data = await res.json();
      setQuestionCount(data.length);
    };

    fetchQuiz();
    fetchQuestions();
  }, [quizId]);

  if (!quiz) return (
    <div className="loading-screen">
      <p>Loading quiz...</p>
    </div>
  );

  return (
    <div className="quiz-page">
      <div className="quiz-card">
        <h1 className="quiz-title">{quiz.title}</h1>
        <p className="quiz-description">{quiz.description || 'No description available.'}</p>

        <div className="quiz-stats">
          <div className="stat-box">
            <span className="stat-number">{questionCount}</span>
            <span className="stat-label">Questions</span>
          </div>
          <div className="stat-box">
            <span className="stat-number">{questionCount * 1}</span>
            <span className="stat-label">Minutes</span>
          </div>
        </div>

        <button
          className="start-button"
          onClick={() => navigate(`/quiz/${quizId}/start`)}
        >
          🚀 Start Quiz
        </button>
      </div>
    </div>
  );
};

export default QuizDetailPage;
