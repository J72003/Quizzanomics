import React, { useState } from 'react';
import axios from 'axios'; // Import Axios

function Upload() {
  const [file, setFile] = useState(null); // To store the selected file
  const [extractedText, setExtractedText] = useState(''); // To store the extracted text
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
      })
      .catch(error => {
        console.error('Error uploading the file:', error);
        setError('Failed to upload the file or extract text.');
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
