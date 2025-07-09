import { useState, useEffect } from 'react';
import axios from 'axios';

function Alerts() {
    const [message, setMessage] = useState('');
    const [deadline, setDeadline] = useState('');
    const [alerts, setAlerts] = useState([]);
    const [, forceUpdate] = useState(0);


    const fetchAlerts = async () => {
        try {
            const res = await axios.get('http://localhost:3000/alerts');
            setAlerts(res.data);
        } catch (err) {
            console.error('Error fetching alerts:', err);
        }
    };


    useEffect(() => {
        fetchAlerts();
        const interval = setInterval(fetchAlerts, 60000);
        return () => clearInterval(interval);
    }, []);


    useEffect(() => {
        const timer = setInterval(() => {
            forceUpdate(n => n + 1);
        }, 1000);

        return () => clearInterval(timer);
    }, []);

    const handleAddAlert = async () => {
        if (!message || !deadline) return;
        try {
            await axios.post('http://localhost:3000/alerts', {
                message,
                deadline,
                source: 'manual'
            });
            setMessage('');
            setDeadline('');
            fetchAlerts();
        } catch (err) {
            console.error('Error adding alert:', err);
        }
    };

    const handleDeleteAlert = async (id) => {
        try {
            await axios.delete(`http://localhost:3000/alerts/${id}`);
            setAlerts(prev => prev.filter(item => item.id !== id));
        } catch (err) {
            console.error('Error deleting alert:', err);
        }
    };

    const getBgColor = (status) => {
        switch (status) {
            case '1-day-left': return 'bg-blue-950';
            case 'now': return 'bg-pink-950';
            case 'done': return 'bg-cyan-950';
            default: return 'bg-yellow-950';
        }
    };

    const getCountdown = (deadlineStr) => {
        const now = new Date();
        const deadline = new Date(deadlineStr);
        const diff = deadline - now;

        if (diff <= 0) return '⏰ It is time';

        const days = Math.floor(diff / (1000 * 60 * 60 * 24));
        const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
        const minutes = Math.floor((diff / (1000 * 60)) % 60);
        const seconds = Math.floor((diff / 1000) % 60);

        return `⏳ ${days}d ${hours}h ${minutes}m ${seconds}s left`;
    };

    const statusLabel = (status) => {
        switch (status) {
            case '1-day-left': return '⚠️ One day left';
            case 'now': return '⏰ It\'s now';
            case 'done': return '✅ Past event';
            default: return '🔔 Upcoming event';
        }
    };

    return (
        <div className="w-full text-green-200 flex flex-col lg:flex-row gap-6">
            {/* LEFT: Create alert */}
            <div className="flex-1">
                <h1 className="text-2xl font-bold mb-3">Alert</h1>
                <input
                    type="text"
                    placeholder="Alert message..."
                    value={message}
                    onChange={e => setMessage(e.target.value)}
                    className="w-full mb-3 p-2 rounded border border-green-200 bg-transparent"
                />
                <input
                    type="date"
                    value={deadline}
                    onChange={e => setDeadline(e.target.value)}
                    className="w-full mb-3 p-2 rounded border border-green-200 bg-transparent"
                />
                <button
                    onClick={handleAddAlert}
                    className="bg-blue-950 px-4 py-2 rounded border-2 border-green-200 hover:bg-blue-700"
                >
                    ➕ Add Alert
                </button>
            </div>


            {/* RIGHT: Pending alerts */}
            <div className="flex-1">
                <h1 className="text-2xl font-bold mb-3">Pending Alerts</h1>
                <ul className="space-y-3">
                    {alerts.map(item => (
                        <li key={item.id} className={`p-3 rounded border shadow ${getBgColor(item.status)}`}>
                            <div className="flex justify-between items-center">
                                <div>
                                    <p>{item.status === 'pending' ? `🔔 ${item.message} — ${item.suffix}` : `${statusLabel(item.status)} — ${item.message}`}</p>
                                    <small className="text-green-300">
                                        🕒 {item.deadline} <br />
                                        {getCountdown(item.deadline)}
                                    </small>
                                </div>
                                <button
                                    onClick={() => handleDeleteAlert(item.id)}
                                    className="text-red-300 hover:text-red-500"
                                >
                                    ✖
                                </button>
                            </div>
                        </li>
                    ))}
                </ul>
            </div>

        </div>
    );
}

export default Alerts;
