import React from 'react';
import './QuestionBlock.css'; 

const QuestionBlock = ({
  question,
  index,
  handleQuestionChange,
  handleAnswerChange,
  addAnswer,
  removeAnswer,
}) => {
  const { text, type, points, answers = [] } = question || {};

  const handleCorrectChange = (aIndex, checked) => {
    let updated = [...answers];

    if (type === 'single') {
      updated = updated.map((a, i) => ({
        ...a,
        is_correct: i === aIndex ? checked : false,
      }));
    } else {
      updated[aIndex].is_correct = checked;
    }

    handleQuestionChange(index, 'answers', updated);
  };

  return (
    <div className="question-block">
      <label className="question-label">Question Text</label>
      <input
        type="text"
        value={text}
        onChange={(e) => handleQuestionChange(index, 'text', e.target.value)}
        placeholder="Enter your question here"
        className="question-input"
      />
  
      <label className="question-label">Points</label>
      <input
        type="number"
        value={points || 1}
        min={1}
        onChange={(e) => handleQuestionChange(index, 'points', parseInt(e.target.value))}
        className="question-input"
      />
  
      <label className="question-label">Question Type</label>
      <select
        value={type}
        onChange={(e) => {
          const newType = e.target.value;
          handleQuestionChange(index, 'type', newType);
          handleQuestionChange(index, 'answers', newType === 'text' ? [] : [{ text: '', is_correct: false }]);
        }}
        className="question-select"
      >
        <option value="single">Single Choice</option>
        <option value="multiple">Multiple Choice</option>
        <option value="text">Text Answer</option>
      </select>
  
      {type !== 'text' &&
        answers.map((a, aIndex) => (
          <div key={a.id || `new-${aIndex}`} className="answer-item">
            <input
              type="text"
              value={a.text}
              placeholder={`Answer ${aIndex + 1}`}
              onChange={(e) => handleAnswerChange(index, aIndex, e.target.value)}
              className="answer-input"
            />
            <label className="correct-toggle">
              ✅
              <input
                type="checkbox"
                checked={a.is_correct || false}
                onChange={(e) => handleCorrectChange(aIndex, e.target.checked)}
              />
            </label>
            <button type="button" onClick={() => removeAnswer(index, aIndex)} className="delete-btn">
              ✖
            </button>
          </div>
        ))}
  
      {type !== 'text' && (
        <button type="button" onClick={() => addAnswer(index)} className="add-answer-btn">
          ➕ Add Answer
        </button>
      )}
    </div>
  );
  
};

  
  export default QuestionBlock;