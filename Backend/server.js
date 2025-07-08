const express = require('express');
const cors = require('cors');
const app = express();
const PORT = 3000;

app.use(cors({ origin: '*' }));
app.use(express.json());

// In-memory storage
let schedule = [];
let notes = [];
let progress = [];
let alerts = [];

// -------- Notes --------
app.get('/', (req, res) => {
    res.send('API is working!');
});
app.get('/notes', (req, res) => res.json(notes));
app.post('/notes', (req, res) => {
    const { title, text } = req.body;
    if (!title || !text) return res.status(400).json({ error: 'Title and text are required.' });
    const newNote = { id: Date.now(), title, text };
    notes.push(newNote);
    res.status(201).json(newNote);
});
app.put('/notes/:id', (req, res) => {
    const { id } = req.params;
    const { title, text } = req.body;
    const idx = notes.findIndex(n => n.id == id);
    if (idx === -1) return res.status(404).json({ error: 'Note not found.' });
    notes[idx] = { ...notes[idx], title, text };
    res.json(notes[idx]);
});
app.delete('/notes/:id', (req, res) => {
    const { id } = req.params;
    const idx = notes.findIndex(n => n.id == id);
    if (idx === -1) return res.status(404).json({ error: 'Note not found.' });
    const deleted = notes.splice(idx, 1);
    res.json(deleted[0]);
});

// -------- Progress --------
app.get('/progress', (req, res) => res.json(progress));
app.post('/progress', (req, res) => {
    const { name, done } = req.body;
    if (!name) return res.status(400).json({ error: 'Name is required' });
    const newItem = { id: Date.now(), name, done: !!done };
    progress.push(newItem);
    res.status(201).json(newItem);
});
app.put('/progress/:id', (req, res) => {
    const { id } = req.params;
    const { name, done } = req.body;
    const idx = progress.findIndex(t => t.id == id);
    if (idx === -1) return res.status(404).json({ error: 'Not found' });
    progress[idx] = { ...progress[idx], name, done: !!done };
    res.json(progress[idx]);
});
app.delete('/progress/:id', (req, res) => {
    const { id } = req.params;
    progress = progress.filter(t => t.id != id);
    res.status(204).send();
});

// -------- Schedule --------
app.get('/schedule', (req, res) => res.json(schedule));
app.post('/schedule', (req, res) => {
    const { title, deadline } = req.body;
