import React from 'react';
import './App.css';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Authentication from './signin/Authentication';
import Register from './signin/Register'
import Main from './home/main';
import Auth from './signin/Auth';
function App() {
  return (
    <div className="App">
      <Router>
        <Routes>
          <Route path="/" element={<Auth/>} />
          <Route path="/login" element={<Authentication />} />
          <Route path="/main" element={<Main />} />
          <Route path="/Auth" element={<Auth />} />
          <Route path="/Register" element={<Register />} />
        </Routes>
      </Router>
      <ToastContainer
        position="top-center"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
    </div>
  );
}

export default App;
