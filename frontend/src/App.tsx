import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Profile from './pages/Profile';
import Notifications from './pages/Notificaation';
import LearningPlans from './pages/LearningPlans';
import ProgressUpdates from './pages/ProgressUpdates';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/profile/:id" element={<Profile />} />
        <Route path="/notifications/:userId" element={<Notifications />} />
        <Route path="/learning-plans" element={<LearningPlans />} />
        <Route path="/progress-updates" element={<ProgressUpdates />} />
      </Routes>
    </Router>
  );
}

export default App;