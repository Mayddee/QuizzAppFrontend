import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import './styles/QuizStartPage.css'; // Assuming you have a CSS file for styles

const QuizStartPage = () => {
  const { quizId } = useParams();
  const navigate = useNavigate();

  const [questions, setQuestions] = useState([]);
  const [answers, setAnswers] = useState({});
  const [loading, setLoading] = useState(true);

  const [quizMeta, setQuizMeta] = useState(null);

  useEffect(() => {
    const fetchQuestionsWithAnswers = async () => {
      try {
        const res = await fetch(`http://localhost:8000/quiz/${quizId}/questions`, {
          credentials: 'include',
        });
        const questionsData = await res.json();

        const questionsWithAnswers = await Promise.all(
          questionsData.map(async (q) => {
            if (q.type === 'single' || q.type === 'multiple') {
              const aRes = await fetch(`http://localhost:8000/question/${q.id}/answers`, {
                credentials: 'include',
              });
              const aData = await aRes.json();
              return { ...q, answers: aData };
            }
            return { ...q, answers: [] };
          })
        );

        setQuestions(questionsWithAnswers);
      } catch (error) {
        console.error("Ошибка загрузки вопросов/ответов", error);
      } finally {
        setLoading(false);
      }
    };
    const fetchMeta = async () => {
      try {
        const res = await fetch(`http://localhost:8000/quiz/${quizId}`, {
          credentials: 'include',
        });
        const data = await res.json();
        setQuizMeta(data);
      } catch (err) {
        console.error("Ошибка загрузки метаданных квиза", err);
      }
    };
  
    fetchMeta();

    fetchQuestionsWithAnswers();
  }, [quizId]);

  const handleTextChange = (qid, value) => {
    setAnswers(prev => ({ ...prev, [qid]: { answer_text: value } }));
  };

  const handleSingleChange = (qid, aid) => {
    setAnswers(prev => ({ ...prev, [qid]: { selected_answer_ids: [aid] } }));
  };

  const handleMultiChange = (qid, aid) => {
    setAnswers(prev => {
      const current = prev[qid]?.selected_answer_ids || [];
      const updated = current.includes(aid)
        ? current.filter(id => id !== aid)
        : [...current, aid];
      return { ...prev, [qid]: { selected_answer_ids: updated } };
    });
  };

  const handleSubmit = async () => {
    try {
      const payload = {
        answers: questions.map(q => {
          const base = { question_id: q.id };
          const userAnswer = answers[q.id] || {};
  
          if (q.type === 'text' && userAnswer.answer_text?.trim()) {
            return { ...base, answer_text: userAnswer.answer_text.trim() };
          }
  
          if ((q.type === 'single' || q.type === 'multiple') && Array.isArray(userAnswer.selected_answer_ids)) {
            return { ...base, selected_answer_ids: userAnswer.selected_answer_ids };
          }
  
          return null;
        }).filter(Boolean)
      };
  
      if (payload.answers.length === 0) {
        alert('Вы не ответили ни на один вопрос.');
        return;
      }
  
      console.log("Final Payload:", payload);
  
      const res = await fetch(`http://localhost:8000/quiz/${quizId}/attempt`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(payload),
      });
  
      if (!res.ok) throw new Error('Ошибка при отправке');
  
      const result = await res.json();
      navigate(`/results/${result.attempt_id}`);
    } catch (err) {
      console.error("Ошибка отправки", err);
      alert('Не удалось отправить ответы.');
    }
  };
  

  const handleCancel = () => {
    navigate('/');
  };

  if (loading) return <div style={{ padding: '20px' }}>Загрузка вопросов...</div>;

  return (
    <div className="quiz-container">
      {quizMeta && (
    <>
      <h1 className="quiz-heading">{quizMeta.title}</h1>
      {quizMeta.description && (
        <p className="quiz-description">{quizMeta.description}</p>
      )}
    </>
  )}

      <form onSubmit={(e) => { e.preventDefault(); handleSubmit(); }}>
        {questions.map((q, index) => (
          <div key={q.id} className="quiz-question">
            <h3 className="question-text">
              {index + 1}. {q.text}
              <span className="points">({q.points} pts)</span>
            </h3>

            {q.type === 'text' && (
              <textarea
                rows="4"
                placeholder="Type your answer here..."
                onChange={(e) => handleTextChange(q.id, e.target.value)}
                className="text-answer"
              />
            )}

            {q.type === 'single' && q.answers.map(ans => (
              <label key={ans.id} className="answer-option">
                <input
                  type="radio"
                  name={`q-${q.id}`}
                  onChange={() => handleSingleChange(q.id, ans.id)}
                  checked={answers[q.id]?.selected_answer_ids?.includes(ans.id) || false}
                />
                {ans.text}
              </label>
            ))}

            {q.type === 'multiple' && q.answers.map(ans => (
              <label key={ans.id} className="answer-option">
                <input
                  type="checkbox"
                  onChange={() => handleMultiChange(q.id, ans.id)}
                  checked={answers[q.id]?.selected_answer_ids?.includes(ans.id) || false}
                />
                {ans.text}
              </label>
            ))}
          </div>
        ))}

        <div className="quiz-actions">
          <button type="submit" className="btn submit-btn">Submit Answers</button>
          <button type="button" className="btn cancel-btn" onClick={handleCancel}>Cancel</button>
        </div>
      </form>
    </div>
  );
};

export default QuizStartPage;
