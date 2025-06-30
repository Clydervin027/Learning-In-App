import { useState, useEffect } from 'react';
import axios from 'axios';

function Notes() {
    const [notes, setNotes] = useState([]);
    const [newTitle, setNewTitle] = useState('');
    const [newText, setNewText] = useState('');
    const [editingId, setEditingId] = useState(null);

    // Fetch notes from the server on initial load
    useEffect(() => {
        axios.get('http://localhost:3000/notes')
            .then(res => setNotes(res.data))
            .catch(err => console.error('Error fetching notes:', err));
    }, []);

    const addOrEditNote = async () => {
        if (!newTitle.trim() || !newText.trim()) return;

        if (editingId) {
            try {
                const updated = { title: newTitle, text: newText };
                await axios.put(`http://localhost:3000/notes/${editingId}`, updated);
                setNotes(notes.map(note =>
                    note.id === editingId ? { ...note, ...updated } : note
                ));
                setEditingId(null);
            } catch (err) {
                console.error('Error updating note:', err);
            }
        } else {
            try {
                const res = await axios.post('http://localhost:3000/notes', {
                    title: newTitle,
                    text: newText
                });
                setNotes([res.data, ...notes]);
            } catch (err) {
                console.error('Error adding note:', err);
            }
        }

        setNewTitle('');
        setNewText('');
    };

    const deleteNote = async (id) => {
        try {
            await axios.delete(`http://localhost:3000/notes/${id}`);
            setNotes(notes.filter(note => note.id !== id));
        } catch (err) {
            console.error('Error deleting note:', err);
        }
    };

    const editNote = (note) => {
        setNewTitle(note.title);
        setNewText(note.text);
        setEditingId(note.id);
    };

    return (
        <div className="w-full ">
            <div className="flex flex-col md:flex-row items-stretch gap-6 min-h-[300px]">
                {/* LEFT: Input Form Section */}
                <div className="flex-1 max-w-162 text-left">
                    <h1 className="text-2xl font-bold text-green-200 mb-4">Notes 📝</h1>
                    <div className="flex flex-col gap-2 mb-6">
                        <input
                            value={newTitle}
                            onChange={(e) => setNewTitle(e.target.value)}
                            placeholder="Title"
                            className="border text-green-200 border-green-200 rounded p-2"
                        />
                        <textarea
                            value={newText}
                            onChange={(e) => setNewText(e.target.value)}
                            rows={10}
                            className="border text-green-200 border-green-200 rounded p-2"
                            placeholder="Write your note here..."
                        />
                        <button
                            onClick={addOrEditNote}
                            className="bg-blue-950 text-green-200 px-4 py-2 rounded hover:bg-blue-700 w-fit border-2 border-green-200"
                        >
                            {editingId ? 'Save 💾' : '➕ Add'}
                        </button>
                    </div>
                </div>


                {/* RIGHT: Notes List Section */}
                <div className="flex-1 max-w-xl text-right w-full">
                    <div className="space-y-3">
                        <h1 className="text-2xl font-bold text-green-200 text-left mb-4">List </h1>
                        {notes.map((note) => (
                            <div
                                key={note.id}
                                className="bg-cyan-950 border rounded p-4 shadow text-left"
                            >
                                <h2 className="font-semibold text-lg text-violet-200">{note.title}</h2>
                                <p className="whitespace-pre-wrap text-violet-200">{note.text}</p>
                                <div className="flex justify-end space-x-1 mt-2">
                                    <button
                                        onClick={() => editNote(note)}
                                        className="text-sm text-violet-200 hover:underline m-3"
                                    >
                                        Edit
                                    </button>
                                    <button
                                        onClick={() => deleteNote(note.id)}
                                        className="text-sm text-violet-200 hover:underline"
                                    >
                                        Delete
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Notes;
