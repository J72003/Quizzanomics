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

@app.route('/api/notes', methods=['POST'])
def add_note():
    data = request.get_json()
    notes.append(data)
    return jsonify({'message': 'Note added!', 'notes': notes}), 201

@app.route('/api/notes', methods=['GET'])
def get_notes():
    return jsonify(notes)

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

    extracted_text = ""
    if file.filename.endswith('.pdf'):
        try:
            reader = PdfReader(filepath)
            for page in reader.pages:
                extracted_text += page.extract_text()  # Extract text from each page
            print(extracted_text)
        except Exception as e:
            return jsonify({'message': 'Error processing PDF', 'error': str(e)}), 500

    os.remove(filepath)
    notes.append({'title': 'Extracted PDF Note', 'content': extracted_text})
    return jsonify({'extracted_text': extracted_text}), 200

# Improved quiz generation with custom questions and enhanced distractors
@app.route('/api/generate-quiz', methods=['POST'])
def generate_quiz():
    data = request.get_json()
    user_notes = data.get('notes', '')

    # Process the notes with spaCy
    doc = nlp(user_notes)

    questions = []

    # Fill-in-the-blank questions
    for sent in doc.sents:
        tokens = [token for token in sent if token.pos_ == "NOUN" or token.pos_ == "PROPN"]
        if tokens:
            blanked_word = tokens[0].text
            question = sent.text.replace(blanked_word, "______")
            questions.append(f"Fill in the blank: {question.strip()}")

    # True/False questions based on named entities
    for ent in doc.ents:
        if ent.label_ in ["PERSON", "ORG", "GPE", "DATE"]:
            true_statement = f"{ent.text} is mentioned in the notes."
            false_statement = f"{ent.text} is not mentioned in the notes."
            questions.append(f"True or False: {random.choice([true_statement, false_statement])}")

    # Multiple-choice questions using dependency parsing
    for sent in doc.sents:
        subject = None
        verb = None
        obj = None

        for token in sent:
            if "subj" in token.dep_:
                subject = token.text
            if token.pos_ == "VERB":
                verb = token.text
            if "obj" in token.dep_:
                obj = token.text

        if subject and verb and obj:
            # Generate realistic distractors using synonyms/antonyms for the object
            distractors = generate_distractors(obj, user_notes)  # Pass user_notes here
            random.shuffle(distractors)
            question = f"Which of the following did {subject} {verb}?"
            multiple_choice = f"{question}\nA) {distractors[0]}\nB) {distractors[1]}\nC) {distractors[2]}\nD) {distractors[3]}"
            questions.append(multiple_choice)

    # Generate matching questions for named entities and their types
    match_question = generate_matching_question(doc.ents)
    if match_question:
        questions.append(match_question)

    # Generate essay prompts based on key sentences
    essay_prompt = generate_essay_prompt(doc)
    if essay_prompt:
        questions.append(essay_prompt)

    if not questions:
        return jsonify({'message': 'No questions generated'}), 400

    return jsonify({'questions': questions}), 200

def generate_distractors(word, user_notes):
    """
    Generate distractors (synonyms and antonyms) for the given word.
    """
    distractors = [word]
    synsets = wordnet.synsets(word)
    if synsets:
        # Get synonyms
        for syn in synsets:
            for lemma in syn.lemmas():
                if lemma.name() not in distractors and len(distractors) < 4:
                    distractors.append(lemma.name())
        # Get antonyms if possible
        if len(distractors) < 4:
            for lemma in synsets[0].lemmas():
                if lemma.antonyms():
                    distractors.append(lemma.antonyms()[0].name())
    # If not enough distractors, add random nouns from the document
    if len(distractors) < 4:
        distractors.extend([token.text for token in nlp(user_notes) if token.pos_ == "NOUN" and token.text not in distractors][:4 - len(distractors)])
    return distractors

def generate_matching_question(entities):
    """
    Generate a matching question where the user has to match entities to their types.
    """
    if len(entities) < 4:
        return None
    question = "Match the following entities with their types:\n"
    options = []
    for ent in entities:
        options.append(f"{ent.text}: {ent.label_}")
    random.shuffle(options)
    return f"{question}\n{options[0]}\n{options[1]}\n{options[2]}\n{options[3]}"

def generate_essay_prompt(doc):
    """
    Generate an essay prompt based on the key sentences of the document.
    """
    important_sentences = [sent.text for sent in doc.sents if len(sent.text) > 50]
    if important_sentences:
        return f"Essay Prompt: Discuss the following topic in detail: '{random.choice(important_sentences)}'"
    return None

if __name__ == '__main__':
    app.run(debug=True)
