import React, { useState, useEffect } from 'react';
import axios from 'axios';

function QuizPage() {
  const [questions, setQuestions] = useState('');
  const [summary, setSummary] = useState('');
  const [answers, setAnswers] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [loadingQuiz, setLoadingQuiz] = useState(true);
  const [loadingSummary, setLoadingSummary] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    // Fetch notes and generate quiz
    axios.get('http://127.0.0.1:5000/api/notes')
      .then(response => {
        const noteContent = response.data[0]?.content || ''; // Get the first note for now
  
        // Call API to generate quiz (corrected URL)
        axios.post('http://127.0.0.1:5000/api/generate-quiz-openai', { notes: noteContent })  // FIXED URL
          .then(response => {
            setQuestions(response.data.questions);
            setLoadingQuiz(false);
          })
          .catch(error => {
            console.error('Error generating quiz:', error);
            setLoadingQuiz(false);
          });
  
        // Call API to summarize notes
        axios.post('http://127.0.0.1:5000/api/summarize-notes', { notes: noteContent })
          .then(response => {
            setSummary(response.data.summary);
            setLoadingSummary(false);
          })
          .catch(error => {
            console.error('Error summarizing notes:', error);
            setLoadingSummary(false);
          });
      })
      .catch(error => {
        console.error('Error fetching notes:', error);
        setLoadingQuiz(false);
        setLoadingSummary(false);
      });
  }, []);
  

  // Handle answer input changes
  const handleInputChange = (event, index) => {
    setAnswers({
      ...answers,
      [index]: event.target.value,
    });
  };

  // Handle quiz submission
  const handleSubmit = () => {
    setSubmitted(true);
  };

  return (
    <div className="container">
      <h2>Quiz Page</h2>
      <p>This is where you'll take quizzes generated from your notes.</p>

      {/* Display the summary of the notes */}
      <h3>Summary of Your Notes</h3>
      {loadingSummary ? (
        <p>Loading summary...</p>
      ) : error ? (
        <p style={{ color: 'red' }}>{error}</p>
      ) : (
        <p>{summary}</p>
      )}

      {/* Display the quiz questions */}
      <h3>Quiz Questions</h3>
      {loadingQuiz ? (
        <p>Loading quiz...</p>
      ) : error ? (
        <p style={{ color: 'red' }}>{error}</p>
      ) : (
        <>
          {questions ? (
            <form>
              {questions.split('\n').map((question, index) => (
                <div key={index} className="question">
                  <label>{question}</label>
                  <input
                    type="text"
                    value={answers[index] || ''}
                    onChange={(e) => handleInputChange(e, index)}
                    disabled={submitted}
                  />
                </div>
              ))}
              {!submitted ? (
                <button type="button" onClick={handleSubmit}>
                  Submit Quiz
                </button>
              ) : (
                <p>Quiz submitted! Your answers have been recorded.</p>
              )}
            </form>
          ) : (
            <p>No questions available.</p>
          )}
        </>
      )}
    </div>
  );
}

export default QuizPage;
