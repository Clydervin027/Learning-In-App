import { Outlet } from 'react-router-dom';
import Navbar from './Navbar';
import GlobalAlerts from './GlobalAlerts.jsx';

function Layout() {
    return (
        <>
            <Navbar />
            <main className="p-4 min-h-screen bg-violet-950 relative">
                <Outlet />
                <GlobalAlerts />
            </main>
        </>
    );
}

export default Layout;
