const express = require('express');
const app = express();

app.use(express.json());

let notes = [];

// Add a new note
app.post('/api/notes', (req, res) => {
  const note = req.body;
  notes.push(note);
  res.status(201).send({ message: 'Note added!', notes });
});

// Get all notes
app.get('/api/notes', (req, res) => {
  res.send(notes);
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
