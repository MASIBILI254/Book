import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import LoginPage from './components/LoginPage.jsx';
import Homepage from './components/Homepage.jsx';
import RegisterPage from './components/RegisterPage.jsx';
import AddBookPage from './components/AddBookPage.jsx'

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<RegisterPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path='/home' Component={Homepage}/>
         <Route path="/add-book" element={<AddBookPage />} />
      </Routes>
    </Router>
  );
}

export default App;
