import React, { useState, useEffect } from 'react';
import axios from 'axios';

function QuizPage() {
  const [questions, setQuestions] = useState([]);
  const [answers, setAnswers] = useState({});
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    // Fetch the quiz questions from the backend
    axios.get('http://127.0.0.1:5000/api/notes') // Replace with correct quiz generation URL
      .then(response => {
        const noteContent = response.data[0]?.content || ''; // Get the first note for now
        return axios.post('http://127.0.0.1:5000/api/generate-quiz', { notes: noteContent });
      })
      .then(response => {
        setQuestions(response.data.questions);
      })
      .catch(error => {
        console.error('Error fetching quiz questions:', error);
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

      {questions.length > 0 ? (
        <form>
          {questions.map((question, index) => (
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
        <p>Loading questions...</p>
      )}
    </div>
  );
}

export default QuizPage;
