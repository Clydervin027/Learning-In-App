import { useState, useEffect } from 'react';
import axios from 'axios';

function Alerts() {
    const [message, setMessage] = useState('');
    const [deadline, setDeadline] = useState('');
    const [alerts, setAlerts] = useState([]);
    const [, forceUpdate] = useState(0);

    // Fetch alerts and show relevant popups
    const fetchAlerts = async () => {
        try {
            const res = await axios.get('http://localhost:3000/alerts');
            setAlerts(res.data);
        } catch (err) {
            console.error('Error fetching alerts:', err);
        }
    };

    // Initial fetch and periodic update every 60 seconds
    useEffect(() => {
        fetchAlerts();
        const interval = setInterval(fetchAlerts, 60000);
        return () => clearInterval(interval);
    }, []);


    useEffect(() => {
        const timer = setInterval(() => {
            forceUpdate(n => n + 1); // Force re-render to update countdowns
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
            fetchAlerts(); // refresh alert list after adding
        } catch (err) {
            console.error('Error adding alert:', err);
        }
    };

    const handleDeleteAlert = async (id) => {
        try {
            await axios.delete(`http://localhost:3000/alerts/${id}`);
            setAlerts(prev => prev.filter(alert => alert.id !== id));
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
                    {alerts.map(alert => (
                        <li key={alert.id} className={`p-3 rounded border shadow ${getBgColor(alert.status)}`}>
                            <div className="flex justify-between items-center">
                                <div>
                                    <p>
                                        {alert.status === 'now'
                                            ? `⏰ ${alert.message.replace('is now!', 'schedule time remaining')}`
                                            : alert.message}
                                    </p>
                                    <small className="text-green-300">
                                        🕒 {alert.deadline} <br />
                                        {getCountdown(alert.deadline)}
                                    </small>
                                </div>
                                <button
                                    onClick={() => handleDeleteAlert(alert.id)}
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
