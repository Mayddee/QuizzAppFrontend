import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

const CorrectAnswersPage = () => {
  const { attemptId } = useParams();
  const [questions, setQuestions] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCorrectAnswers = async () => {
      try {
        const res = await fetch(`http://localhost:8000/attempts/${attemptId}/correct-answers`, {
          credentials: 'include',
        });
        const data = await res.json();
        setQuestions(data);
      } catch (error) {
        console.error("Ошибка загрузки правильных ответов", error);
      }
    };

    fetchCorrectAnswers();
  }, [attemptId]);

  if (!questions.length) return <div style={{ padding: '20px' }}>Загрузка...</div>;

  return (
    <div style={{ padding: '40px', maxWidth: '800px', margin: '0 auto' }}>
      <h1>Правильные ответы</h1>

      <ul style={{ listStyle: 'none', padding: 0 }}>
        {questions.map((q, index) => (
          <li key={q.id} style={{ marginBottom: '30px' }}>
            <p><strong>{index + 1}. {q.text}</strong></p>
            {q.correct_answers.map((ans, i) => (
              <p key={i}>✅ {ans}</p>
            ))}
          </li>
        ))}
      </ul>

      <div style={{ textAlign: 'center' }}>
        <button onClick={() => navigate('/')} className="result-btn blue">На главную</button>
      </div>
    </div>
  );
};

export default CorrectAnswersPage;
