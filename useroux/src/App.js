import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HomePage from './pages/homepage/HomePage';
import UploadSolve from './pages/UploadSolve';
import Login from './pages/Login';
import Logout from './pages/Logout';
import Solve from './pages/solvepage/Solve';

/**
 * @file App.js
 * @author Devin Arena
 * @since 11/24/2021
 * @description Main application file which handles routing for the site.
 */

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/upload" element={<UploadSolve />} />
        <Route path="/login" element={<Login />} />
        <Route path="/logout" element={<Logout />} />
        <Route path="/solve/:id" element={<Solve />} />
      </Routes>
    </Router>
  );
}

export default App;
