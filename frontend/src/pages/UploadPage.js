import React, { useState } from 'react';
import axios from 'axios';
import './UploadPage.css'; // Assuming you create this CSS file to match the theme

function UploadPage() {
  const [file, setFile] = useState(null);
  const [uploadStatus, setUploadStatus] = useState('');
  const [error, setError] = useState('');

  const handleFileChange = (event) => {
    setFile(event.target.files[0]);
  };

  const handleFileUpload = () => {
    const formData = new FormData();
    formData.append('file', file);

    axios.post('http://127.0.0.1:5000/api/upload', formData)
      .then(response => {
        setUploadStatus('File uploaded successfully!');
        setError('');
      })
      .catch(error => {
        console.error('Error uploading file:', error);
        setError('Failed to upload the file.');
        setUploadStatus('');
      });
  };

  return (
    <div className="upload-container">
      <h2 className="upload-header">Upload Your Notes</h2>
      <p>Upload your study materials to generate quizzes and flashcards.</p>

      <div className="file-upload-area">
        <input type="file" onChange={handleFileChange} className="file-input" />
        <button className="upload-button" onClick={handleFileUpload}>Upload</button>
      </div>

      {uploadStatus && <p className="upload-status">{uploadStatus}</p>}
      {error && <p style={{ color: 'red' }}>{error}</p>}
    </div>
  );
}

export default UploadPage;
