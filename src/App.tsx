import React from 'react';
import './App.css';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Authentication from './signin/Authentication';
import Register from './signin/Register'
import Main from './home/main';
import Auth from './signin/Auth';
import AdminPage from './pages/AdminPage';

function App() {
  return (
    <div className="App min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <Router>
        <Routes>
          <Route path="/" element={<Auth/>} />
          <Route path="/login" element={<Authentication />} />
          <Route path="/main" element={<Main />} />
          <Route path="/Auth" element={<Auth />} />
          <Route path="/Register" element={<Register />} />
          <Route path="/admin" element={<AdminPage />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Router>
      <ToastContainer
        position="top-right"
        autoClose={4000}
        hideProgressBar={false}
        newestOnTop={true}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
        toastClassName="backdrop-blur-md bg-white/90 border border-white/20 shadow-xl rounded-xl text-gray-800 font-medium"
        progressClassName="bg-gradient-to-r from-blue-500 to-purple-500"
      />
    </div>
  );
}

export default App;
