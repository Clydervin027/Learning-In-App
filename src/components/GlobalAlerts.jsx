import { useState, useEffect } from 'react';
import axios from 'axios';

function GlobalAlerts() {
    const [popups, setPopups] = useState([]);

    const fetchAndTriggerPopups = async () => {
        try {
            const res = await axios.get('http://localhost:3000/alerts');
            const now = new Date();

            const eligiblePopups = res.data.filter(alert => {
                const diff = new Date(alert.deadline) - now;
                return (
                    (alert.status === '1-day-left' && diff > 0 && diff <= 86400000) ||
                    (alert.status === 'now' && Math.abs(diff) <= 60000)
                );
            });

            eligiblePopups.forEach(alert => {
                const alreadyShown = popups.some(p => p.id === alert.id && p.message === alert.message);
                if (!alreadyShown) {
                    setPopups(prev => [...prev, { ...alert, popupId: Date.now() + Math.random() }]);
                }
            });
        } catch (err) {
            console.error('Global popup fetch error:', err);
        }
    };

    useEffect(() => {
        fetchAndTriggerPopups();
        const interval = setInterval(fetchAndTriggerPopups, 60000);
        return () => clearInterval(interval);
    }, []);

    useEffect(() => {
        const timers = popups.map(p =>
            setTimeout(() => {
                setPopups(prev => prev.filter(x => x.popupId !== p.popupId));
            }, 5000)
        );
        return () => timers.forEach(clearTimeout);
    }, [popups]);

    return (
        <div className="fixed bottom-4 right-4 flex flex-col gap-2 z-50">
            {popups.map(popup => (
                <div
                    key={popup.popupId}
                    className="bg-cyan-950 text-green-200 px-4 py-2 rounded shadow flex justify-between items-center min-w-[260px]"
                >
                    <span className="mr-3">{popup.message}</span>
                    <button
                        onClick={() => setPopups(prev => prev.filter(p => p.popupId !== popup.popupId))}
                        className="text-red-300 hover:text-red-500"
                    >
                        ✖
                    </button>
                </div>
            ))}
        </div>
    );
}

export default GlobalAlerts;
