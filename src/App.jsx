import { Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Home from './pages/Home';
import { Schedule } from './pages/Schedule';
import Notes from './pages/Notes';
import Progress from './pages/Progress';
import Uploads from './pages/Uploads';
import Alerts from './pages/Alerts';

function App() {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<Home />} />
        <Route path="schedule" element={<Schedule />} />
        <Route path="notes" element={<Notes />} />
        <Route path="progress" element={<Progress />} />
        <Route path="uploads" element={<Uploads />} />
        <Route path="alerts" element={<Alerts />} />
      </Route>
    </Routes>
  );
}

export default App;