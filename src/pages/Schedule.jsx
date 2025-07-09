import { useState, useEffect } from 'react';
import axios from 'axios';

function Schedule() {
    const [title, setTitle] = useState('');
    const [date, setDate] = useState('');
    const [events, setEvents] = useState([]);

    // Fetch events from the server on load
    const fetchEvents = async () => {
        try {
            const res = await axios.get('http://localhost:3000/schedule');
            setEvents(res.data);
        } catch (err) {
            console.error('Error fetching schedule:', err);
        }
    };

    useEffect(() => {
        fetchEvents();
    }, []);

    // Countdown updater (force rerender)
    useEffect(() => {
        const interval = setInterval(() => {
            setEvents(prev => [...prev]); // triggers rerender
        }, 1000);
        return () => clearInterval(interval);
    }, []);

    const addEvent = async () => {
        if (!title || !date) return;
        try {
            const res = await axios.post('http://localhost:3000/schedule', {
                title,
                deadline: date
            });
            setEvents(prev => [...prev, res.data]);
            setTitle('');
            setDate('');
        } catch (err) {
            console.error('Error adding event:', err);
        }
    };

    const deleteEvent = async (id) => {
        try {
            await axios.delete(`http://localhost:3000/schedule/${id}`);
            setEvents(prev => prev.filter(ev => ev.id !== id));
        } catch (err) {
            console.error('Error deleting event:', err);
        }
    };

    const getCountdown = (dateStr) => {
        const now = new Date();
        const target = new Date(dateStr);
        const diff = target - now;

        if (diff <= 0) return '⏰ It is time';

        const days = Math.floor(diff / (1000 * 60 * 60 * 24));
        const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
        const minutes = Math.floor((diff / (1000 * 60)) % 60);
        const seconds = Math.floor((diff / 1000) % 60);

        return `⏳ ${days}d ${hours}h ${minutes}m ${seconds}s left`;
    };

    const sortedEvents = [...events].sort(
        (a, b) => new Date(a.deadline) - new Date(b.deadline)
    );

    return (
        <div className="w-full text-left">
            <h1 className="text-2xl font-bold text-green-200">Schedule 📅</h1>

            <div className="flex flex-col sm:flex-row gap-4 mt-2 mb-2">
                <input
                    type="date"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    className="p-2 border rounded flex-1 text-green-200 bg-transparent border-green-200"
                />
                <input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="Event title..."
                    className="p-2 border rounded flex-1 text-green-200 bg-transparent border-green-200"
                />
                <button
                    onClick={addEvent}
                    className="px-4 py-2 bg-blue-950 text-green-200 rounded hover:bg-blue-700 h-fit border-2 border-green-200"
                >
                    ➕ Add
                </button>
            </div>

            <ul className="space-y-2">
                {sortedEvents.map((event) => (
                    <li
                        key={event.id}
                        className="p-4 bg-cyan-950 rounded border shadow flex justify-between items-center"
                    >
                        <div className="text-green-200">
                            <strong>{new Date(event.deadline).toLocaleString()}</strong> — {event.title}
                            <br />
                            <span className="text-sm">{getCountdown(event.deadline)}</span>
                        </div>
                        <button
                            onClick={() => deleteEvent(event.id)}
                            className="text-red-300 text-sm hover:underline"
                        >
                            ✖ Delete
                        </button>
                    </li>
                ))}
            </ul>
        </div>
    );
}

// Optional shared export for other components
export function fetchSchedules() {
    return axios.get('http://localhost:3000/schedule').then(res => res.data);
}

export { Schedule };