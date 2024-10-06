import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './StudyPage.css'; // Assuming you create this CSS file to match the theme

function StudyPage() {
  const [flashcards, setFlashcards] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    // Fetch flashcards from the backend
    axios.get('http://127.0.0.1:5000/api/notes') // Example API call
      .then(response => {
        const noteContent = response.data[0]?.content || '';
        // Call API to generate flashcards
        axios.post('http://127.0.0.1:5000/api/generate-flashcards', { notes: noteContent })
          .then(response => {
            const flashcardsArray = response.data.flashcards.split('\n'); // Ensure it's an array of flashcards
            setFlashcards(flashcardsArray);
            setLoading(false);
          })
          .catch(error => {
            console.error('Error generating flashcards:', error);
            setError('Failed to generate flashcards.');
            setLoading(false);
          });
      })
      .catch(error => {
        console.error('Error fetching notes:', error);
        setError('Failed to fetch notes.');
        setLoading(false);
      });
  }, []);

  return (
    <div className="study-container">
      <h2 className="study-header">Study Flashcards</h2>
      <p>Review the key points and materials based on your uploaded notes.</p>

      {loading ? (
        <p>Loading flashcards...</p>
      ) : error ? (
        <p style={{ color: 'red' }}>{error}</p>
      ) : (
        <div className="flashcards-list">
          {flashcards.map((card, index) => (
            <div key={index} className="flashcard">
              <p>{card}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default StudyPage;
