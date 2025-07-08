import { Link, useLocation } from 'react-router-dom';

function Navbar() {
    const { pathname } = useLocation();

    const links = [
        { to: '/', emoji: '🏠', label: 'Home' },
        { to: '/schedule', emoji: '🗓️', label: 'Schedule' },
        { to: '/notes', emoji: '📝', label: 'Notes' },
        { to: '/progress', emoji: '📈', label: 'Progress' },
        { to: '/uploads', emoji: '📤', label: 'Uploads' },
        { to: '/alerts', emoji: '🚨', label: 'Alerts' },
    ];

    return (
        <nav className="bg-purple-700 shadow p border-5 border-green-200 border-double rounded-lg">
            <div className="flex justify-start">
                <h1 className="ml-4 mt-4 p-2 bg-purple-900 border-3 rounded-full justify-start text-green-200 text-3x1 font-bold">IN-APP</h1>
            </div>
            <ul className="flex space-x-6 justify-end mr-4">
                {links.map(link => (
                    <li key={link.to}>
                        <Link
                            to={link.to}
                            className={`flex flex-col items-center text-sm font-medium ${pathname === link.to
                                ? 'text-green-200 underline'
                                : 'text-green-200 hover:text-green-500'
                                }`}
                        >
                            <span className="text-xl">{link.emoji}</span>
                            <span>{link.label}</span>
                        </Link>
                    </li>
                ))}
            </ul>
        </nav>
    );
}

export default Navbar;