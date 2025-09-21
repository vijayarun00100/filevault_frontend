import React from 'react';
import { useNavigate } from 'react-router-dom';
import { MdLogin, MdPersonAdd, MdCloud, MdSecurity, MdSpeed } from 'react-icons/md';

function Auth() {
  const navigate = useNavigate();
  
  return (
    <div className='min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex items-center justify-center p-4'>
      <div className='max-w-4xl w-full'>
        <div className='text-center mb-12'>
          <div className='flex items-center justify-center mb-6'>
            <div className='w-16 h-16 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg'>
              {React.createElement(MdCloud as React.ComponentType<any>, { className: 'text-3xl text-white' })}
            </div>
          </div>
          <h1 className='text-5xl font-bold text-gray-800 mb-4'>
            Welcome to <span className='bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent'>FileVault</span>
          </h1>
          <p className='text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed'>
          A safe place to store & retrieve your files !!
          </p>
        </div>
        <div className='grid md:grid-cols-3 gap-6 mb-12'>
          <div className='bg-white/70 backdrop-blur-sm rounded-2xl p-6 text-center shadow-lg border border-white/20 hover:shadow-xl transition-all duration-300'>
            <div className='w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center mx-auto mb-4'>
              {React.createElement(MdSecurity as React.ComponentType<any>, { className: 'text-2xl text-blue-600' })}
            </div>
            <h3 className='text-lg font-semibold text-gray-800 mb-2'>Secure Storage</h3>
            <p className='text-gray-600 text-sm'>Uses SHA256 for storage and JWT for authentication</p>
          </div>
          
          <div className='bg-white/70 backdrop-blur-sm rounded-2xl p-6 text-center shadow-lg border border-white/20 hover:shadow-xl transition-all duration-300'>
            <div className='w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center mx-auto mb-4'>
              {React.createElement(MdSpeed as React.ComponentType<any>, { className: 'text-2xl text-purple-600' })}
            </div>
            <h3 className='text-lg font-semibold text-gray-800 mb-2'>Fast like lightning</h3>
            <p className='text-gray-600 text-sm'>Uses graphql and go for backend</p>
          </div>
          
          <div className='bg-white/70 backdrop-blur-sm rounded-2xl p-6 text-center shadow-lg border border-white/20 hover:shadow-xl transition-all duration-300'>
            <div className='w-12 h-12 bg-indigo-100 rounded-xl flex items-center justify-center mx-auto mb-4'>
              {React.createElement(MdCloud as React.ComponentType<any>, { className: 'text-2xl text-indigo-600' })}
            </div>
            <h3 className='text-lg font-semibold text-gray-800 mb-2'>Share files</h3>
            <p className='text-gray-600 text-sm'>Share files with others</p>
          </div>
        </div>

        <div className='flex flex-col sm:flex-row gap-4 justify-center items-center'>
          <button 
            onClick={() => navigate('/login')}
            className='group flex items-center gap-3 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white px-8 py-4 rounded-2xl font-semibold text-lg shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 min-w-[200px]'
          >
            {React.createElement(MdLogin as React.ComponentType<any>, { className: 'text-xl group-hover:rotate-12 transition-transform duration-300' })}
            Sign In
          </button>
          
          <button 
            onClick={() => navigate('/Register')}
            className='group flex items-center gap-3 bg-white hover:bg-gray-50 text-gray-800 px-8 py-4 rounded-2xl font-semibold text-lg shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 border-2 border-gray-200 hover:border-gray-300 min-w-[200px]'
          >
            {React.createElement(MdPersonAdd as React.ComponentType<any>, { className: 'text-xl group-hover:rotate-12 transition-transform duration-300' })}
            Create Account
          </button>
        </div>
        <div className='text-center mt-12'>
          <p className='text-gray-500 text-sm'>
            Created By vijayarun :)
          </p>
        </div>
      </div>
    </div>
  );
}

export default Auth;