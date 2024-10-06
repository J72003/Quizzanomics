import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './QuizPage.css'; // Assuming you have your styles here

function QuizPage() {
  const [quizQuestions, setQuizQuestions] = useState([]); // Initialize as an array
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
        const noteContent = response.data[0]?.content || ''; 

        // Call API to generate quiz (corrected URL)
        axios.post('http://127.0.0.1:5000/api/generate-quiz', { notes: noteContent })
          .then(response => {
            const questionsArray = Array.isArray(response.data.questions) ? response.data.questions : [];
            setQuizQuestions(questionsArray); // Ensure it's an array
            setLoadingQuiz(false);
          })
          .catch(error => {
            console.error('Error generating quiz:', error);
            setError('Failed to generate quiz questions.');
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
            setError('Failed to summarize notes.');
            setLoadingSummary(false);
          });
      })
      .catch(error => {
        console.error('Error fetching notes:', error);
        setError('Failed to fetch notes.');
        setLoadingQuiz(false);
        setLoadingSummary(false);
      });
  }, []);

  // Handle answer input changes for fill-in-the-blank
  const handleInputChange = (event, index) => {
    setAnswers({
      ...answers,
      [index]: event.target.value,
    });
  };

  // Handle answer selection for multiple choice
  const handleOptionChange = (index, option) => {
    setAnswers({
      ...answers,
      [index]: option,
    });
  };

  // Handle quiz submission
  const handleSubmit = () => {
    setSubmitted(true);
  };

  return (
    <div className="quiz-container">
      <h2 className="quiz-header">Quiz Page</h2>
      <p>This is where you'll take quizzes generated from your notes.</p>

      {/* Summary of the notes */}
      <div className="summary-container">
        <h3>Summary of Your Notes</h3>
        {loadingSummary ? (
          <p>Loading summary...</p>
        ) : error ? (
          <p style={{ color: 'red' }}>{error}</p>
        ) : (
          <p>{summary}</p>
        )}
      </div>

      {/* Display the quiz questions */}
      <h3>Quiz Questions</h3>
      {loadingQuiz ? (
        <p>Loading quiz...</p>
      ) : error ? (
        <p style={{ color: 'red' }}>{error}</p>
      ) : (
        <form>
          <p>Here is a list of quiz questions based on your notes:</p>
          {Array.isArray(quizQuestions) && quizQuestions.length > 0 ? (
            quizQuestions.map((question, index) => (
              <div key={index} className="question-card">
                {question.type === 'multiple-choice' ? (
                  <>
                    <label className="question-label">{index + 1}. {question.question}</label>
                    <div className="options-container">
                      {question.options.map((option, optionIndex) => (
                        <div key={optionIndex} className="option">
                          <input
                            type="radio"
                            name={`question-${index}`}
                            value={option}
                            checked={answers[index] === option}
                            onChange={() => handleOptionChange(index, option)}
                            disabled={submitted}
                          />
                          <label>{option}</label>
                        </div>
                      ))}
                    </div>
                  </>
                ) : (
                  // Fill-in-the-blank question
                  <>
                    <label className="question-label">{index + 1}. {question.question}</label>
                    <input
                      type="text"
                      className="answer-input"
                      value={answers[index] || ''}
                      onChange={(e) => handleInputChange(e, index)}
                      disabled={submitted}
                    />
                  </>
                )}
              </div>
            ))
          ) : (
            <p>No questions available.</p>
          )}
          {!submitted ? (
            <button type="button" className="submit-button" onClick={handleSubmit}>
              Submit Quiz
            </button>
          ) : (
            <p>Quiz submitted! Your answers have been recorded.</p>
          )}
        </form>
      )}
    </div>
  );
}

export default QuizPage;
