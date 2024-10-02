import React from 'react';
import Form from '../components/Form'; // The form imported 

function Home() {
  return (
    <div>
      <h1>Welcome to Quizzanomics</h1>
      <p>Your study assistant for personalized quizzes and flashcards.</p>

      {/* Add the Form component here */}
      <Form />
    </div>

  );
}

export default Home;
