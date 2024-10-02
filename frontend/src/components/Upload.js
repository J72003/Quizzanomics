import React, { useState } from 'react';
import axios from 'axios'; // Import Axios

function Upload() {
  const [file, setFile] = useState(null); // To store the selected file
  const [extractedText, setExtractedText] = useState(''); // To store the extracted text
  const [quizQuestions, setQuizQuestions] = useState([]); // To store generated quiz questions
  const [error, setError] = useState('');

  // Handle file input change
  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
    setError(''); // Clear previous errors if a new file is selected
  };

  // Handle the file upload and extraction
  const handleUpload = () => {
    if (!file) {
      setError('Please select a file first.');
      return;
    }

    const formData = new FormData();
    formData.append('file', file); // Append the file to form data

    // Send the file to the backend via Axios
    axios.post('http://127.0.0.1:5000/api/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    })
      .then(response => {
        setExtractedText(response.data.extracted_text); // Set the extracted text in state
        setError(''); // Clear any error messages

        // Save extracted text as a note
        axios.post('http://127.0.0.1:5000/api/notes', { title: 'Extracted PDF Note', content: response.data.extracted_text })
          .then(() => {
            console.log('Note saved successfully!');
          })
          .catch(error => {
            console.error('Error saving extracted text:', error);
          });

      })
      .catch(error => {
        console.error('Error uploading the file:', error);
        setError('Failed to upload the file or extract text.');
      });
  };

  // Function to generate quiz questions from the extracted text
  const handleGenerateQuiz = () => {
    if (!extractedText) {
      setError('No notes available to generate quiz.');
      return;
    }

    axios.post('http://127.0.0.1:5000/api/generate-quiz', { notes: extractedText })
      .then(response => {
        setQuizQuestions(response.data.questions); // Set the generated quiz questions
        setError('');
      })
      .catch(error => {
        console.error('Error generating quiz:', error);
        setError('Failed to generate quiz.');
      });
  };

  return (
    <div className="container">
      <h2>Upload Your Notes (PDF Only)</h2>
      <input type="file" onChange={handleFileChange} />
      <button onClick={handleUpload}>Upload and Extract Text</button>

      {/* Display the extracted text */}
      {extractedText && (
        <div>
          <h3>Extracted Text:</h3>
          <pre>{extractedText}</pre> {/* Use <pre> to keep formatting */}
        </div>
      )}

      {/* Button to generate quiz questions */}
      {extractedText && (
        <div>
          <h3>Generate Quiz from Extracted Text</h3>
          <button onClick={handleGenerateQuiz}>Generate Quiz</button>
        </div>
      )}

      {/* Display generated quiz questions */}
      {quizQuestions.length > 0 && (
        <div>
          <h3>Generated Quiz Questions:</h3>
          <ul>
            {quizQuestions.map((question, index) => (
              <li key={index}>{question}</li>
            ))}
          </ul>
        </div>
      )}

      {/* Display error messages */}
      {error && (
        <div style={{ color: 'red' }}>
          <p>{error}</p>
        </div>
      )}
    </div>
  );
}

export default Upload;
