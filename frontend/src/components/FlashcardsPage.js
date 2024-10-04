import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Flashcard from './Flashcard';
import './Flashcard.css';  // Import the CSS for styling

function FlashcardsPage() {
  const [flashcards, setFlashcards] = useState([]);  // Store flashcards
  const [loading, setLoading] = useState(true);  // Loading state
  const [error, setError] = useState('');  // Error state

  useEffect(() => {
    // Fetch notes and generate flashcards
    axios.get('http://127.0.0.1:5000/api/notes')
      .then(response => {
        const noteContent = response.data[0]?.content || ''; // Get the first note content

        // Call API to generate flashcards
        axios.post('http://127.0.0.1:5000/api/generate-flashcards', { notes: noteContent })
          .then(response => {
            // Parse the response from the API to create flashcards
            const generatedFlashcards = response.data.flashcards.split('\n');  // Assuming the API returns new-line-separated flashcards
            const flashcardPairs = generatedFlashcards.map(flashcard => {
              const [front, back] = flashcard.split(':');  // Assuming each flashcard is in the format 'front:back'
              return { front: front.trim(), back: back.trim() };
            });
            setFlashcards(flashcardPairs);  // Set the flashcards in state
            setLoading(false);  // Stop loading once flashcards are fetched
          })
          .catch(error => {
            console.error('Error generating flashcards:', error);
            setError('Failed to generate flashcards. Please try again later.');  // Set error message if flashcard generation fails
            setLoading(false);  // Stop loading
          });
      })
      .catch(error => {
        console.error('Error fetching notes:', error);
        setError('Failed to fetch notes. Please ensure notes are available.');  // Set error message if fetching notes fails
        setLoading(false);  // Stop loading
      });
  }, []);  // Empty dependency array ensures this effect runs only once when the component mounts

  return (
    <div className="container">
      <h2>Study Flashcards</h2>
      {loading ? (
        <p>Loading flashcards...</p>  // Display loading message while waiting for flashcards
      ) : error ? (
        <p style={{ color: 'red' }}>{error}</p>  // Display error message if an error occurred
      ) : (
        <div className="flashcards-grid">
          {/* Map over the flashcards and render the Flashcard component for each one */}
          {flashcards.map((card, index) => (
            <Flashcard key={index} front={card.front} back={card.back} />
          ))}
        </div>
      )}
    </div>
  );
}

export default FlashcardsPage;
