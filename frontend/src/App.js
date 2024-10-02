import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Home from './pages/Home';
import QuizPage from './pages/QuizPage';
import StudyPage from './pages/StudyPage';
import './App.css'; // Keep the CSS if you're using it for styling

function App() {
  return (
    <Router>
      <div className="App">
        <header className="App-header">
          <h1>Welcome to Quizzanomics</h1>
        </header>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/quiz" element={<QuizPage />} />
          <Route path="/study" element={<StudyPage />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
