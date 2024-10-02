from flask import Flask, request, jsonify
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

# Dummy data for notes
notes = []

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

if __name__ == '__main__':
    app.run(debug=True)
