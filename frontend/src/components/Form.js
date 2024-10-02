import React, { useState, useEffect } from 'react';
import axios from 'axios'; // Import Axios

function Form() {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [notes, setNotes] = useState([]);

  // Fetch notes from the backend when the component mounts
  useEffect(() => {
    fetchNotes();
  }, []);

  const fetchNotes = () => {
    axios.get('http://127.0.0.1:5000/api/notes')
      .then(response => {
        setNotes(response.data); // Set notes in state
      })
      .catch(error => {
        console.error('There was an error fetching the notes!', error);
      });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Data to send to the backend
    const note = { title, content };

    // Send POST request to the Flask backend
    axios.post('http://127.0.0.1:5000/api/notes', note)
      .then(response => {
        console.log('Note added:', response.data);
        fetchNotes(); // Refresh the notes list after adding a new note
      })
      .catch(error => {
        console.error('There was an error adding the note!', error);
      });

    // Clear the form fields
    setTitle('');
    setContent('');
  };

  // Handle deleting a note
  const handleDelete = (index) => {
    axios.delete(`http://127.0.0.1:5000/api/notes/${index}`)
      .then(response => {
        console.log('Note deleted:', response.data);
        // Remove the note from the state immediately after successful deletion
        const updatedNotes = notes.filter((_, i) => i !== index); // Filter out the deleted note
        setNotes(updatedNotes); // Update the state to trigger UI update
      })
      .catch(error => {
        console.error('There was an error deleting the note!', error);
      });
  };

  return (
    <div className="container">
      <h2 className="text-center">Add Your Study Notes</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Title</label>
          <input 
            type="text" 
            value={title} 
            onChange={(e) => setTitle(e.target.value)} 
            required 
          />
        </div>
        <div className="form-group">
          <label>Content</label>
          <textarea 
            value={content} 
            onChange={(e) => setContent(e.target.value)} 
            rows="5"
            required 
          />
        </div>
        <button type="submit">Add Note</button>
      </form>

      {/* Display the list of notes */}
      <h3 className="text-center mt-4">Your Notes</h3>
      <ul>
        {notes.map((note, index) => (
          <li key={index} style={{ marginBottom: '20px' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <span><strong>{note.title}</strong>: {note.content}</span>
              {/* Delete button as an 'X' */}
              <span 
                className="delete-button" 
                onClick={() => handleDelete(index)}
                style={{ cursor: 'pointer', fontSize: '20px', marginLeft: '10px' }}
              >
                &times;
              </span>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default Form;
