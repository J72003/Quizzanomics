// src/pages/UploadPage.js

import React from 'react';
import Upload from '../components/Upload'; // Import the Upload component

function UploadPage() {
  return (
    <div className="upload-page">
      <h2>Upload Your Class Notes</h2>
      <Upload /> {/* Render the Upload component for file uploading */}
    </div>
  );
}

export default UploadPage;
