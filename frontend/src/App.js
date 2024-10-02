import React from 'react';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom'; // Add 'Link' for navigation
import Home from './pages/Home';
import QuizPage from './pages/QuizPage';
import StudyPage from './pages/StudyPage';
import UploadPage from './pages/UploadPage';  // Import the Upload page
import './App.css';  // Keep the CSS for styling

function App() {
  return (
    <Router>
      <div className="App">
        <header className="App-header">
          <h1>Welcome to Quizzanomics</h1>
          {/* Navigation links */}
          <nav>
            <Link to="/">Home</Link> | 
            <Link to="/quiz">Quiz</Link> | 
            <Link to="/study">Study</Link> | 
            <Link to="/upload">Upload Notes</Link> {/* Link to the Upload page */}
          </nav>
        </header>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/quiz" element={<QuizPage />} />
          <Route path="/study" element={<StudyPage />} />
          <Route path="/upload" element={<UploadPage />} />  {/* Add the new Upload route */}
        </Routes>
      </div>
    </Router>
  );
}

export default App;
