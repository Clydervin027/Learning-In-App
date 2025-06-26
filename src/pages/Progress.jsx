import { useState, useEffect } from 'react';
import axios from 'axios';

function Progress() {
    const [topics, setTopics] = useState([]);
    const [input, setInput] = useState('');
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        // Load from backend
        axios.get('http://localhost:3000/progress')
            .then(res => setTopics(res.data))
            .catch(err => console.error('Error loading progress:', err));
    }, []);

    const addTopic = async () => {
        if (!input.trim()) return;
        setLoading(true);
        try {
            const res = await axios.post('http://localhost:3000/progress', {
                name: input,
                done: false
            });
            setTopics(prev => [...prev, res.data]);
            setInput('');
        } catch (err) {
            console.error('Error adding topic:', err);
        }
        setLoading(false);
    };

    const toggleDone = async (id) => {
        const topic = topics.find(t => t.id === id);
        if (!topic) return;
        try {
            const res = await axios.put(`http://localhost:3000/progress/${id}`, {
                name: topic.name,
                done: !topic.done
            });
            setTopics(topics.map(t => t.id === id ? res.data : t));
        } catch (err) {
            console.error('Error updating topic:', err);
        }
    };

    const removeTopic = async (id) => {
        try {
            await axios.delete(`http://localhost:3000/progress/${id}`);
            setTopics(topics.filter(t => t.id !== id));
        } catch (err) {
            console.error('Error deleting topic:', err);
        }
    };

    return (
        <div className="w-full max-w-xl text-left px-6">
            <h1 className="text-2xl font-bold text-green-200 mb-4">Progress Tracker 📈</h1>

            <div className="flex gap-2 mb-6">
                <input
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    className="border border-green-200 text-green-200 px-3 py-2 rounded w-full"
                    placeholder="Add topic or goal..."
                />
                <button
                    onClick={addTopic}
                    disabled={loading}
                    className="bg-blue-950 text-green-200 px-2 py-2 rounded hover:bg-blue-700 border border-green-200 w-30"
                >
                    {loading ? 'Saving...' : '➕ Add'}
                </button>
            </div>

            <ul className="space-y-2">
                {[...topics]
                    .sort((a, b) => a.done - b.done) // show undone on top
                    .map((topic) => (
                        <li
                            key={topic.id}
                            className={`p-3 flex justify-between items-center rounded shadow ${topic.done
                                ? 'bg-cyan-950 line-through text-green-200'
                                : 'bg-cyan-900 text-green-200'
                                }`}
                        >
                            <span>{topic.name}</span>
                            <div className="flex gap-2">
                                <button
                                    onClick={() => toggleDone(topic.id)}
                                    className="text-sm px-2 py-1 rounded bg-cyan-700 text-green-200"
                                >
                                    {topic.done ? 'Undo' : 'Done'}
                                </button>
                                <button
                                    onClick={() => removeTopic(topic.id)}
                                    className="text-sm text-green-200 hover:underline hover:text-red-300"
                                >
                                    Delete
                                </button>
                            </div>
                        </li>
                    ))}
            </ul>
        </div>
    );
}

export default Progress;