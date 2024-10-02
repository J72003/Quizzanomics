// src/pages/UploadPage.js

import React, { useState } from 'react';
import Upload from '../components/Upload'; // Import the Upload component
import axios from 'axios';  // To make API requests

function UploadPage() {
  const [inputNotes, setInputNotes] = useState('');  // Store manually typed notes
  const [storedNotes, setStoredNotes] = useState('');  // Store notes from the backend
  const [quizQuestions, setQuizQuestions] = useState([]);  // Store generated quiz questions

  // Function to handle manual note input
  const handleInputNotesChange = (e) => {
    setInputNotes(e.target.value);
  };

  // Function to save inputted notes to the backend
  const handleSaveNotes = () => {
    axios.post('http://127.0.0.1:5000/api/notes', { title: 'Manual Input', content: inputNotes })
      .then(response => {
        setStoredNotes(inputNotes);  // Save the input notes in the state
        setInputNotes('');  // Clear the input field
      })
      .catch(error => {
        console.error('Error saving notes:', error);
      });
  };

  // Function to generate quiz questions from stored notes
  const handleGenerateQuiz = () => {
    axios.post('http://127.0.0.1:5000/api/generate-quiz', { notes: storedNotes })
      .then(response => {
        setQuizQuestions(response.data.questions);  // Set the generated quiz questions
      })
      .catch(error => {
        console.error('Error generating quiz:', error);
      });
  };

  return (
    <div className="upload-page">
      <h2>Upload or Input Your Class Notes</h2>
      <Upload />  {/* File upload component */}

      <h3>Manually Input Notes</h3>
      <textarea
        value={inputNotes}
        onChange={handleInputNotesChange}
        rows="5"
        placeholder="Type your notes here..."
      />
      <button onClick={handleSaveNotes}>Save Notes</button>

      {storedNotes && (
        <div>
          <h3>Your Stored Notes:</h3>
          <p>{storedNotes}</p>
        </div>
      )}

      {storedNotes && (
        <div>
          <h3>Generate Quiz from Notes</h3>
          <button onClick={handleGenerateQuiz}>Generate Quiz</button>
        </div>
      )}

      {quizQuestions.length > 0 && (
        <div>
          <h3>Generated Quiz Questions</h3>
          <ul>
            {quizQuestions.map((question, index) => (
              <li key={index}>{question}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

export default UploadPage;
