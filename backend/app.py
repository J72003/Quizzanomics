from PyPDF2 import PdfReader
from flask import Flask, request, jsonify
from flask_cors import CORS
import os

app = Flask(__name__)
CORS(app)

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

# New delete route
@app.route('/api/notes/<int:index>', methods=['DELETE'])
def delete_note(index):
    if 0 <= index < len(notes):
        removed_note = notes.pop(index)
        return jsonify({'message': 'Note deleted!', 'note': removed_note}), 200
    else:
        return jsonify({'message': 'Note not found!'}), 404

# Route to handle PDF file upload and text extraction
@app.route('/api/upload', methods=['POST'])
def upload_file():
    # Check if the post request has the file part
    if 'file' not in request.files:
        return jsonify({'message': 'No file part'}), 400

    file = request.files['file']

    # If no file was selected
    if file.filename == '':
        return jsonify({'message': 'No selected file'}), 400

    # Save the uploaded file
    filepath = os.path.join(UPLOAD_FOLDER, file.filename)
    file.save(filepath)

    # Extract text from the uploaded PDF using PyPDF2
    extracted_text = ""
    if file.filename.endswith('.pdf'):
        try:
            reader = PdfReader(filepath)
            for page in reader.pages:
                extracted_text += page.extract_text()  # Extract text from each page
        except Exception as e:
            return jsonify({'message': 'Error processing PDF', 'error': str(e)}), 500

    # Remove the file after processing
    os.remove(filepath)

    # Return the extracted text as a response (for now)
    return jsonify({'extracted_text': extracted_text}), 200

if __name__ == '__main__':
    app.run(debug=True)
