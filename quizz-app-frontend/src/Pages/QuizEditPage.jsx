import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import QuestionBlock from '../Components/QuestionBlock';
import './styles/QuizEditPage.css'; // Assuming you have a CSS file for styles

const QuizEditPage = () => {
  const { quizId } = useParams();
  const navigate = useNavigate();
  const [quiz, setQuiz] = useState({ title: '', description: '' });
  const [questions, setQuestions] = useState([]);
  const [originalQuestions, setOriginalQuestions] = useState([]);

  useEffect(() => {
    const fetchQuizData = async () => {
      const quizRes = await fetch(`http://localhost:8000/quiz/${quizId}`, { credentials: 'include' });
      const quizData = await quizRes.json();
      setQuiz({ title: quizData.title, description: quizData.description });

      const qRes = await fetch(`http://localhost:8000/quiz/${quizId}/questions`, { credentials: 'include' });
      const qData = await qRes.json();

      const withAnswers = await Promise.all(qData.map(async q => {
        if (q.type !== 'text') {
          const aRes = await fetch(`http://localhost:8000/question/${q.id}/answers`, { credentials: 'include' });
          const aData = await aRes.json();
          return { ...q, answers: aData };
        }
        return { ...q, answers: [] };
      }));

      setQuestions(withAnswers);
      setOriginalQuestions(withAnswers);
    };

    fetchQuizData();
  }, [quizId]);

  const handleQuizChange = (e) => setQuiz(prev => ({ ...prev, [e.target.name]: e.target.value }));


  const handleQuestionChange = (i, field, value) => {
    const copy = [...questions];
    copy[i][field] = value;
    if (field === 'type') copy[i].answers = value === 'text' ? [] : [{ text: '' }];
    setQuestions(copy);
  };
  const handleAnswerChange = (qi, ai, value) => {
    const copy = [...questions];
    copy[qi].answers[ai].text = value;
    setQuestions(copy);
  };
  const addAnswer = (qi) => {
    const copy = [...questions];
    copy[qi].answers.push({ text: '', is_correct: false });
    setQuestions(copy);
  };
  const removeAnswer = (qi, ai) => {
    const copy = [...questions];
    copy[qi].answers.splice(ai, 1);
    setQuestions(copy);
  };

  const addQuestion = () => {
    setQuestions(prev => [...prev, {
      id: `new-${Date.now()}`,
      text: '',
      type: 'single',
      points: 1,
      answers: [{ text: '', is_correct: false }]
    }]);
  };



const handleSave = async () => {
  await fetch(`http://localhost:8000/quiz/${quizId}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: JSON.stringify({
      title: quiz.title,
      description: quiz.description,
    }),
  });

  const deletedQuestions = originalQuestions.filter(
    oq => !questions.find(q => q.id === oq.id)
  );
  for (let dq of deletedQuestions) {
    await fetch(`http://localhost:8000/question/${dq.id}`, {
      method: 'DELETE',
      credentials: 'include',
    });
  }

  for (let q of questions) {
    if (String(q.id).startsWith('new-')) {
      // Новый вопрос — создаём
      const res = await fetch(`http://localhost:8000/question`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          quiz_id: parseInt(quizId),
          text: q.text,
          type: q.type,
          points: q.points || 1,
        }),
      });
      const newQuestion = await res.json();

      for (let a of q.answers) {
        await fetch(`http://localhost:8000/answers`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          credentials: 'include',
          body: JSON.stringify({
            question_id: newQuestion.id,
            text: a.text,
            is_correct: a.is_correct || false,
          }),
        });
      }
    } else {
      const original = originalQuestions.find(oq => oq.id === q.id);
      const changed = !original ||
        q.text !== original.text ||
        q.points !== original.points ||
        q.type !== original.type;

      if (changed) {
        await fetch(`http://localhost:8000/question/${q.id}`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          credentials: 'include',
          body: JSON.stringify({
            text: q.text,
            points: q.points,
            type: q.type,
          }),
        });

        if (q.type === 'text' && original?.type !== 'text') {
          const oldAnswers = original.answers || [];
          for (let da of oldAnswers) {
            await fetch(`http://localhost:8000/answers/${da.id}`, {
              method: 'DELETE',
              credentials: 'include',
            });
          }
        }
      }

      const originalAnswers = original?.answers || [];
      const deletedAnswers = originalAnswers.filter(
        oa => !q.answers.find(a => a.id === oa.id)
      );
      for (let da of deletedAnswers) {
        await fetch(`http://localhost:8000/answers/${da.id}`, {
          method: 'DELETE',
          credentials: 'include',
        });
      }

      // 5. Обновляем или создаём ответы
      for (let a of q.answers) {
        if (a.id) {
          await fetch(`http://localhost:8000/answers/${a.id}`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            credentials: 'include',
            body: JSON.stringify({
              text: a.text,
              is_correct: a.is_correct || false,
            }),
          });
        } else {
          await fetch(`http://localhost:8000/answers`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            credentials: 'include',
            body: JSON.stringify({
              question_id: q.id,
              text: a.text,
              is_correct: a.is_correct || false,
            }),
          });
        }
      }
    }
  }

  alert('Quiz successfully updated!');
  navigate('/my-quizzes');
};



const handleDelete = async () => {
  await fetch(`http://localhost:8000/quiz/${quizId}`, {
    method: 'DELETE',
    credentials: 'include',
  });
  alert('Quiz deleted.');
  navigate('/my-quizzes');
};

return (
  <div className="quiz-editor-container">
    <h2 className="quiz-editor-heading">Edit Your Quiz</h2>

    <input
      name="title"
      value={quiz.title}
      onChange={handleQuizChange}
      placeholder="Enter quiz title"
      className="quiz-editor-input"
    />

    <textarea
      name="description"
      value={quiz.description}
      onChange={handleQuizChange}
      rows={3}
      placeholder="Enter quiz description"
      className="quiz-editor-textarea"
    />

    {questions.map((question, index) => (
      <QuestionBlock
        key={question.id}
        question={question}
        index={index}
        handleQuestionChange={(i, field, value) => {
          const updated = [...questions];
          updated[i][field] = value;
          setQuestions(updated);
        }}
        handleAnswerChange={(qIdx, aIdx, text) => {
          const updated = [...questions];
          updated[qIdx].answers[aIdx].text = text;
          setQuestions(updated);
        }}
        addAnswer={(qIdx) => {
          const updated = [...questions];
          updated[qIdx].answers.push({ text: '', is_correct: false });
          setQuestions(updated);
        }}
        removeAnswer={(qIdx, aIdx) => {
          const updated = [...questions];
          updated[qIdx].answers.splice(aIdx, 1);
          setQuestions(updated);
        }}
      />
    ))}

    <button className="quiz-editor-add-btn" onClick={addQuestion}>
      ➕ Add Question
    </button>

    <div className="quiz-editor-actions">
      <button className="quiz-editor-btn save" onClick={handleSave}>💾 Save</button>
      <button className="quiz-editor-btn delete" onClick={handleDelete}>🗑 Delete</button>
      <button className="quiz-editor-btn cancel" onClick={() => navigate('/my-quizzes')}>↩ Cancel</button>
    </div>
  </div>
);

};

export default QuizEditPage;

