import React, { useState } from 'react';
import './Flashcard.css';  // This imports the styles


function Flashcard({ front, back }) {
  const [flipped, setFlipped] = useState(false);

  return (
    <div className="flashcard" onClick={() => setFlipped(!flipped)}>
      <div className="flashcard-content">
        {flipped ? <p>{back}</p> : <p>{front}</p>}
      </div>
    </div>
  );
}

export default Flashcard;
