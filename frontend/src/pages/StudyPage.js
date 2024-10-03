import React, { useState, useEffect } from 'react';
import axios from 'axios';

function StudyPage() {
  const [notes, setNotes] = useState([]);
  const [currentNote, setCurrentNote] = useState(0);
  const [flashcardView, setFlashcardView] = useState(false);

  useEffect(() => {
    // Fetch the notes from the backend
    axios.get('http://127.0.0.1:5000/api/notes')
      .then(response => {
        setNotes(response.data);
      })
      .catch(error => {
        console.error('Error fetching notes:', error);
      });
  }, []);

  const handleNextNote = () => {
    setCurrentNote((prev) => (prev + 1) % notes.length);
  };

  const handleToggleFlashcard = () => {
    setFlashcardView(!flashcardView);
  };

  return (
    <div className="container">
      <h2>Study Page</h2>
      <p>This is where you can review your notes with flashcards and spaced repetition.</p>

      {notes.length > 0 ? (
        <div>
          <button onClick={handleToggleFlashcard}>
            {flashcardView ? 'View Notes' : 'Flashcard Mode'}
          </button>

          {flashcardView ? (
            <div className="flashcard">
              <h3>Flashcard {currentNote + 1}</h3>
              <p>{notes[currentNote].content.split(' ').slice(0, 10).join(' ')}...</p>
              <button onClick={handleNextNote}>Next Flashcard</button>
            </div>
          ) : (
            <div className="note-content">
              <h3>Note {currentNote + 1}</h3>
              <p>{notes[currentNote].content}</p>
              <button onClick={handleNextNote}>Next Note</button>
            </div>
          )}
        </div>
      ) : (
        <p>No notes available. Please upload notes to start studying.</p>
      )}
    </div>
  );
}

export default StudyPage;
