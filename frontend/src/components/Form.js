import React, { useState } from 'react';
import './Form.css'; // Ensure you're linking to your CSS file

function Form() {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Submitted:', { title, content });
    setTitle('');
    setContent('');
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
            placeholder="Enter title"
            required 
          />
        </div>
        <div className="form-group">
          <label>Content</label>
          <textarea 
            value={content} 
            onChange={(e) => setContent(e.target.value)} 
            placeholder="Enter content"
            rows="5"
            required 
          />
        </div>
        <button type="submit">
          <i className="fas fa-plus"></i> Add Note
        </button>
      </form>
    </div>
  );
}

export default Form;
