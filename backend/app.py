import cohere
from PyPDF2 import PdfReader
from flask import Flask, request, jsonify
from flask_cors import CORS
import os
import random
import spacy
import nltk
from nltk.corpus import wordnet

app = Flask(__name__)
CORS(app)

# Add your Cohere API key here
COHERE_API_KEY = 'TbJME3S2nBkSS2lNsGvTZEfFt67MGkI7Jv0JzQwD'
co = cohere.Client(COHERE_API_KEY)

# Load spaCy model
nlp = spacy.load("en_core_web_sm")

# Download WordNet from NLTK
nltk.download('wordnet')

# Dummy data for notes
notes = []

# Upload folder (temporary folder to store uploaded files)
UPLOAD_FOLDER = 'uploads'
if not os.path.exists(UPLOAD_FOLDER):
    os.makedirs(UPLOAD_FOLDER)

# Function to extract text from uploaded PDF
def extract_text_from_pdf(filepath):
    extracted_text = ""
    try:
        reader = PdfReader(filepath)
        for page in reader.pages:
            extracted_text += page.extract_text()  # Extract text from each page
        print(extracted_text)
    except Exception as e:
        return str(e)
    return extracted_text

# Cohere function to generate quiz questions from notes
def generate_questions_with_cohere(note_text):
    prompt = f"Create a list of quiz questions based on the following notes:\n\n{note_text}\n\n"
    try:
        response = co.generate(
            model='command-xlarge-nightly',  # Cohere's model for text generation
            prompt=prompt,
            max_tokens=200,
            temperature=0.7,
        )
        questions_text = response.generations[0].text.strip()
        # Split the text into an array of questions
        questions = questions_text.split('\n')
        return questions
    except Exception as e:
        return str(e)

# Cohere function to summarize notes
def summarize_notes_with_cohere(note_text):
    prompt = f"Summarize the following notes:\n\n{note_text}\n\n"
    try:
        response = co.generate(
            model='command-xlarge-nightly',  # Cohere's summarization model
            prompt=prompt,
            max_tokens=150,
            temperature=0.5,
        )
        summary = response.generations[0].text.strip()
        return summary
    except Exception as e:
        return str(e)

# Cohere function to generate flashcards from notes
def generate_flashcards_with_cohere(note_text):
    prompt = f"Generate concise flashcards from the following notes:\n\n{note_text}\n\n"
    try:
        response = co.generate(
            model='command-xlarge-nightly',  # Cohere's model for text generation
            prompt=prompt,
            max_tokens=300,
            temperature=0.5,
        )
        flashcards = response.generations[0].text.strip()
        return flashcards
    except Exception as e:
        return str(e)

# Route to handle PDF file upload and text extraction
@app.route('/api/upload', methods=['POST'])
def upload_file():
    if 'file' not in request.files:
        return jsonify({'message': 'No file part'}), 400

    file = request.files['file']

    if file.filename == '':
        return jsonify({'message': 'No selected file'}), 400

    filepath = os.path.join(UPLOAD_FOLDER, file.filename)
    file.save(filepath)

    # Extract text from the uploaded PDF
    extracted_text = extract_text_from_pdf(filepath)

    # Remove the file after processing
    os.remove(filepath)

    # Append the extracted text to notes
    notes.append({'title': file.filename, 'content': extracted_text})

    return jsonify({'extracted_text': extracted_text}), 200

@app.route('/api/generate-quiz', methods=['POST'])
def generate_quiz():
    data = request.get_json()
    user_notes = data.get('notes', '')

    # Generate quiz using Cohere API
    questions = generate_questions_with_cohere(user_notes)

    return jsonify({'questions': questions})

# Route to handle summarization with Cohere
@app.route('/api/summarize-notes', methods=['POST'])
def summarize_notes():
    data = request.get_json()
    user_notes = data.get('notes', '')

    # Call Cohere to summarize the notes
    summary = summarize_notes_with_cohere(user_notes)

    return jsonify({'summary': summary})

# Route to handle flashcard generation with Cohere
@app.route('/api/generate-flashcards', methods=['POST'])
def generate_flashcards():
    data = request.get_json()
    user_notes = data.get('notes', '')

    # Call Cohere to generate flashcards based on the notes
    flashcards = generate_flashcards_with_cohere(user_notes)

    return jsonify({'flashcards': flashcards})

# Route to retrieve all notes
@app.route('/api/notes', methods=['GET'])
def get_notes():
    return jsonify(notes)

# Route to add a note manually
@app.route('/api/notes', methods=['POST'])
def add_note():
    data = request.get_json()
    notes.append(data)
    return jsonify({'message': 'Note added!', 'notes': notes}), 201

# Route to delete a specific note
@app.route('/api/notes/<int:index>', methods=['DELETE'])
def delete_note(index):
    if 0 <= index < len(notes):
        removed_note = notes.pop(index)
        return jsonify({'message': 'Note deleted!', 'note': removed_note}), 200
    else:
        return jsonify({'message': 'Note not found!'}), 404

if __name__ == '__main__':
    app.run(debug=True)