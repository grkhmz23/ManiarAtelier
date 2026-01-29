import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Men from './pages/Men';
import Women from './pages/Women';

export default function App() {
  return (
    <Router>
      <div className="min-h-screen bg-white text-gray-900 font-sans">
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/men" element={<Men />} />
          <Route path="/women" element={<Women />} />
        </Routes>
      </div>
    </Router>
  );
}
