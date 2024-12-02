import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'; // Import React Router
import SignIn from './SignIn';
import SignUp from './SignUp';
import './App.css';

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<SignIn />} /> 
          <Route path="/signup" element={<SignUp />} /> 
        </Routes>
      </div>
    </Router>
  );
}

export default App;
