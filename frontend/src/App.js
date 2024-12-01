import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'; 
import SignIn from './pages/SignIn';
import SignUp from './pages/SignUp';
import Nav from './Navbar/Nav';
import './App.css';

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<SignIn />} /> 
          <Route path="/signup" element={<SignUp />} /> 
          <Route path="/navbar" element={<Nav />} /> 
        </Routes>
      </div>
    </Router>
  );
}

export default App;
