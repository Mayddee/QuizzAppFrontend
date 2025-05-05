import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import QuestionBlock from '../Components/QuestionBlock';
import './styles/QuizCreatePage.css'; // Assuming you have a CSS file for styles

const QuizCreatePage = () => {
  const navigate = useNavigate();
  const [quiz, setQuiz] = useState({ title: '', description: '', tags: [] });
  const [questions, setQuestions] = useState([]);

  const handleQuizChange = (e) => setQuiz(prev => ({ ...prev, [e.target.name]: e.target.value }));

  const handleTagInput = (e) => {
    const tags = e.target.value
      .split(',')
      .map(t => t.trim().toLowerCase())
      .filter(t => t); // remove empty strings
    setQuiz(prev => ({ ...prev, tags }));
  };

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
    copy[qi].answers.push({ text: '' });
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
      answers: [{ text: '' }]
    }]);
  };

  const isValidQuiz = () => {
    return quiz.title.trim() && questions.length > 0 && questions.every(q =>
      q.text.trim() &&
      (q.type === 'text' || (q.answers && q.answers.length > 0 && q.answers.every(a => a.text.trim())))
    );
  };

  

const handleCreate = async () => {
    try {
      // 1. Create the quiz
      const quizRes = await fetch(`http://localhost:8000/quiz/create`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          title: quiz.title,
          description: quiz.description,
        }),
      });
  
      if (!quizRes.ok) throw new Error('Failed to create quiz');
      const { quiz_id } = await quizRes.json();
  
      // 2. Create each question and its answers
      for (const q of questions) {
        const questionRes = await fetch(`http://localhost:8000/question`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          credentials: 'include',
          body: JSON.stringify({
            quiz_id,
            text: q.text,
            type: q.type,
            points: q.points || 1,
          }),
        });
  
        if (!questionRes.ok) throw new Error('Failed to create question');
        const newQ = await questionRes.json();
  
        if (q.type !== 'text') {
          for (const a of q.answers) {
            const answerRes = await fetch(`http://localhost:8000/answers`, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              credentials: 'include',
              body: JSON.stringify({
                question_id: newQ.id,
                text: a.text,
                is_correct: a.is_correct || false,
              }),
            });
  
            if (!answerRes.ok) throw new Error('Failed to create answer');
          }
        }
      }
  
      // 3. Create and attach tags
      for (const tag of quiz.tags) {
        // Create tag if not exists
        await fetch(`http://localhost:8000/tags`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          credentials: 'include',
          body: JSON.stringify({ name: tag }),
        });
  
        // Attach tag to quiz
        await fetch(`http://localhost:8000/quiz/${quiz_id}/add-tag`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          credentials: 'include',
          body: JSON.stringify({ name: tag }),
        });
      }
  
      alert('🎉 Quiz created successfully!');
      navigate('/my-quizzes');
    } catch (error) {
      console.error('❌ Error creating quiz:', error);
      alert('Failed to create quiz. Please check console for details.');
    }
  };
  

  return (
    <div className="quiz-create-container">
      <h2 className="quiz-create-heading">📝 Create a New Quiz</h2>
  
      <label className="input-label">Quiz Title</label>
      <input
        name="title"
        value={quiz.title}
        onChange={handleQuizChange}
        placeholder="Enter quiz title"
        className="input-field"
      />
  
      <label className="input-label">Description</label>
      <textarea
        name="description"
        value={quiz.description}
        onChange={handleQuizChange}
        placeholder="Enter quiz description"
        rows={3}
        className="textarea-field"
      />
  
      <label className="input-label">Tags (comma-separated)</label>
      <input
        type="text"
        placeholder="e.g. Math, Science, Logic"
        onChange={handleTagInput}
        className="input-field"
      />
  
      {questions.map((q, i) => (
        <QuestionBlock
          key={q.id}
          question={q}
          index={i}
          handleQuestionChange={handleQuestionChange}
          handleAnswerChange={handleAnswerChange}
          addAnswer={addAnswer}
          removeAnswer={removeAnswer}
        />
      ))}
  
      <button onClick={addQuestion} className="btn btn-add">
        ➕ Add Question
      </button>
  
      <button
        onClick={handleCreate}
        disabled={!isValidQuiz()}
        className={`btn btn-create ${!isValidQuiz() ? 'btn-disabled' : ''}`}
      >
        🚀 Create Quiz
      </button>
    </div>
  );
  
};

export default QuizCreatePage;
