import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import './styles/UserResultsPage.css'; // Assuming you have a CSS file for styles

export default function UserResultsPage() {
  const { attemptId } = useParams();
  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchResults = async () => {
      try {
        const res = await fetch(`http://localhost:8000/attempts/${attemptId}`, {
          credentials: 'include',
        });
        if (!res.ok) throw new Error("Failed to fetch results");
        const data = await res.json();
        setResults(data);
      } catch (err) {
        console.error("Error fetching results:", err);
        setResults(null);
      } finally {
        setLoading(false);
      }
    };

    fetchResults();
  }, [attemptId]);

  if (loading) return <div>Loading...</div>;
  if (!results) return <div>Failed to load results.</div>;

  return (
    <div className="results-container">
      <h1 className="results-title">🎉 Quiz Results</h1>
      <p className="results-score">Score: <span>{results.score}</span> / {results.max_score}</p>
  
      <h2 className="answers-heading">Your Answers</h2>
      <ul className="answers-list">
        {results.answers.map((ans, i) => (
          <li key={ans.question_id} className="answer-item">
            <p className="question-id question-style">#{i + 1} — <strong>Question ID:</strong> {ans.question_id}</p>
  
            {ans.answer_text && (
              <p className="question-style"><strong>Your Answer:</strong> <span className="user-answer">{ans.answer_text}</span></p>
            )}
  
            {ans.selected_answer_ids && ans.selected_answer_ids.length > 0 && (
              <p className="question-style"><strong className="questioN-style">Selected Option IDs:</strong> <span className="user-answer">{ans.selected_answer_ids.join(', ')}</span></p>
            )}
  
            <div className="answer-meta">
              <span className={`badge ${ans.is_correct ? 'correct' : 'incorrect'}`}>
                {ans.is_correct ? '✅ Correct' : '❌ Incorrect'}
              </span>
              <span className="points">Points Awarded: <strong>{ans.points_awarded}</strong></span>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
  
}
