import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './styles/MyQuizzesPage.css';

const MyQuizzesPage = () => {
  const [quizzes, setQuizzes] = useState([]);
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('my');

  useEffect(() => {
    const fetchMyQuizzes = async () => {
      const res = await fetch('http://localhost:8000/quiz/my-quizzes', {
        credentials: 'include',
      });
      const data = await res.json();
      setQuizzes(data);
    };
    fetchMyQuizzes();
  }, []);

  return (
    <div className="my-quizzes-container">
      <div className="top-controls">
        <button
          onClick={() => setActiveTab('my')}
          className={`tab-btn ${activeTab === 'my' ? 'active' : ''}`}
        >
          My Quizzes
        </button>
        <button onClick={() => navigate('/quiz/create')} className="create-btn">
          + Create New Quiz
        </button>
      </div>

      {activeTab === 'my' && (
        <div className="quiz-cards">
          {quizzes.map((q) => (
            <div className="quiz-card" key={q.id}>
              <h3 onClick={() => navigate(`/quiz/${q.id}`)} className="quiz-title">
                {q.title}
              </h3>
              {q.description && <p className="quiz-desc">{q.description}</p>}
              <button onClick={() => navigate(`/quiz/${q.id}/edit`)} className="edit-btn">
                ✏️ Edit
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyQuizzesPage;
