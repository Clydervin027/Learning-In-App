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
    if (!title || !deadline) return res.status(400).json({ error: 'Title and deadline are required' });

    const newSchedule = { id: Date.now(), title, deadline };
    schedule.push(newSchedule);

    // Also add alert associated with schedule
    alerts.push({
        id: Date.now() + 1,
        message: `${title} is one day left`,
        deadline,
        source: 'schedule',
        status: 'pending'
    });

    res.status(201).json(newSchedule);
});
app.delete('/schedule/:id', (req, res) => {
    const { id } = req.params;
    const index = schedule.findIndex(s => s.id == id);
    if (index === -1) return res.status(404).json({ error: 'Schedule not found' });
    const deleted = schedule.splice(index, 1);
    res.json(deleted[0]);
});

// -------- Alerts --------
function updateAlertStatuses() {
    const now = new Date();
    alerts = alerts.map(alert => {
        const diff = new Date(alert.deadline) - now;
        const daysLeft = Math.floor(diff / (1000 * 60 * 60 * 24));

        if (diff <= 0) return { ...alert, status: 'done', message: alert.source === 'schedule' ? `The ${alert.message.replace(' is one day left', '')} is now` : `${alert.message} is now` };
        if (daysLeft === 0) return { ...alert, status: 'now' };
        if (daysLeft === 1) return { ...alert, status: '1-day-left' };
        return { ...alert, status: 'pending' };
    });
}

app.get('/alerts', (req, res) => {
    const now = new Date();

    alerts = alerts.map(alert => {
        const alertTime = new Date(alert.deadline);
        const diff = alertTime - now;

        let status = 'pending';
        if (diff <= 0) {
            status = 'now';
        } else if (diff <= 86400000) {
            status = '1-day-left';
        } else {
            status = 'pending';
        }

        // Once the alert is past for some time, mark as done
        if (diff < -3600000) { // more than 1 hour ago
            status = 'done';
        }

        return { ...alert, status };
    });

    res.json(alerts);
});

app.post('/alerts', (req, res) => {
    const { message, deadline, source } = req.body;
    if (!message || !deadline) return res.status(400).json({ error: 'Message and deadline are required.' });

    const newAlert = {
        id: Date.now(),
        message,
        deadline,
        source: source || 'manual',
        status: 'pending'
    };

    alerts.push(newAlert);
    res.status(201).json(newAlert);
});

app.delete('/alerts/:id', (req, res) => {
    const { id } = req.params;
    alerts = alerts.filter(alert => alert.id != id);
    res.status(204).send();
});


// Alert status updater
setInterval(() => {
    const now = new Date();
    alerts.forEach(alert => {
        const diff = new Date(alert.deadline) - now;
        if (diff > 86400000) {
            alert.status = 'pending';
        } else if (diff <= 86400000 && diff > 0) {
            alert.status = '1-day-left';
        } else if (diff <= 0 && now.toDateString() === new Date(alert.deadline).toDateString()) {
            alert.status = 'now';
        } else {
            alert.status = 'done';
        }
    });
}, 60000); // every 60 seconds

// -------- Start Server --------
app.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
});
