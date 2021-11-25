import HomePage from './homepage/HomePage';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

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
      </Routes>
    </Router>
  );
}

export default App;
