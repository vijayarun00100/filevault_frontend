import React from 'react';
import { useNavigate } from 'react-router-dom';
import { MdLogin, MdPersonAdd, MdCloud, MdSecurity, MdSpeed, MdAdminPanelSettings } from 'react-icons/md';

function Auth() {
  const navigate = useNavigate();
  
  return (
    <div className='min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex items-center justify-center p-4'>
      <div className='max-w-6xl w-full'>
        <div className='text-center mb-16'>
          <div className='flex items-center justify-center mb-8'>
            <div className='w-20 h-20 lg:w-24 lg:h-24 bg-gradient-to-r from-blue-600 to-purple-600 rounded-3xl flex items-center justify-center shadow-2xl backdrop-blur-sm'>
              {React.createElement(MdCloud as React.ComponentType<any>, { className: 'text-4xl lg:text-5xl text-white' })}
            </div>
          </div>
          <h1 className='text-4xl lg:text-6xl xl:text-7xl font-bold text-gray-800 mb-6 leading-tight'>
            Welcome to <span className='bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent'>FileVault</span>
          </h1>
          <p className='text-lg lg:text-2xl text-gray-600 max-w-3xl mx-auto leading-relaxed'>
            A safe place to store & retrieve your files securely
          </p>
        </div>
        <div className='grid sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8 mb-16'>
          <div className='bg-white/80 backdrop-blur-md rounded-2xl p-6 lg:p-8 text-center shadow-xl border border-white/30 hover:shadow-2xl hover:scale-105 transition-all duration-300 group'>
            <div className='w-16 h-16 bg-gradient-to-r from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg group-hover:scale-110 transition-transform duration-300'>
              {React.createElement(MdSecurity as React.ComponentType<any>, { className: 'text-3xl text-white' })}
            </div>
            <h3 className='text-xl font-bold text-gray-800 mb-3'>Secure Storage</h3>
            <p className='text-gray-600 leading-relaxed'>Enterprise-grade security with SHA256 encryption and JWT authentication</p>
          </div>
          
          <div className='bg-white/80 backdrop-blur-md rounded-2xl p-6 lg:p-8 text-center shadow-xl border border-white/30 hover:shadow-2xl hover:scale-105 transition-all duration-300 group'>
            <div className='w-16 h-16 bg-gradient-to-r from-purple-500 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg group-hover:scale-110 transition-transform duration-300'>
              {React.createElement(MdSpeed as React.ComponentType<any>, { className: 'text-3xl text-white' })}
            </div>
            <h3 className='text-xl font-bold text-gray-800 mb-3'>Lightning Fast</h3>
            <p className='text-gray-600 leading-relaxed'>Powered by GraphQL and Go backend for optimal performance</p>
          </div>
          
          <div className='bg-white/80 backdrop-blur-md rounded-2xl p-6 lg:p-8 text-center shadow-xl border border-white/30 hover:shadow-2xl hover:scale-105 transition-all duration-300 group sm:col-span-2 lg:col-span-1'>
            <div className='w-16 h-16 bg-gradient-to-r from-indigo-500 to-indigo-600 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg group-hover:scale-110 transition-transform duration-300'>
              {React.createElement(MdCloud as React.ComponentType<any>, { className: 'text-3xl text-white' })}
            </div>
            <h3 className='text-xl font-bold text-gray-800 mb-3'>Easy Sharing</h3>
            <p className='text-gray-600 leading-relaxed'>Share files instantly with secure links and access controls</p>
          </div>
        </div>

        <div className='flex flex-col sm:flex-row gap-4 lg:gap-6 justify-center items-center'>
          <button 
            onClick={() => navigate('/login')}
            className='group flex items-center justify-center gap-3 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white px-8 py-4 rounded-2xl font-semibold text-lg shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105 active:scale-95 min-w-[220px] w-full sm:w-auto'
          >
            {React.createElement(MdLogin as React.ComponentType<any>, { className: 'text-xl group-hover:rotate-12 transition-transform duration-300' })}
            Sign In
          </button>
          
          <button 
            onClick={() => navigate('/Register')}
            className='group flex items-center justify-center gap-3 bg-white hover:bg-gray-50 text-gray-800 px-8 py-4 rounded-2xl font-semibold text-lg shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105 active:scale-95 border-2 border-gray-200 hover:border-gray-300 min-w-[220px] w-full sm:w-auto'
          >
            {React.createElement(MdPersonAdd as React.ComponentType<any>, { className: 'text-xl group-hover:rotate-12 transition-transform duration-300' })}
            Create Account
          </button>
          
          <button 
            onClick={() => navigate('/admin')}
            className='group flex items-center justify-center gap-3 bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white px-8 py-4 rounded-2xl font-semibold text-lg shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105 active:scale-95 min-w-[220px] w-full sm:w-auto'
          >
            {React.createElement(MdAdminPanelSettings as React.ComponentType<any>, { className: 'text-xl group-hover:rotate-12 transition-transform duration-300' })}
            Admin Panel
          </button>
        </div>
        <div className='text-center mt-16'>
          <p className='text-gray-500 text-sm lg:text-base'>
            Created with ❤️ by <span className='font-semibold text-gray-700'>vijayarun</span>
          </p>
        </div>
      </div>
    </div>
  );
}

export default Auth;