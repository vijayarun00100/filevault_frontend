import React, { useState } from 'react';
import { ApolloClient, HttpLink, InMemoryCache, from } from '@apollo/client';
import { ApolloProvider } from '@apollo/client/react';
import { setContext } from '@apollo/client/link/context';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { MdAdminPanelSettings, MdArrowBack, MdCloud } from 'react-icons/md';
import AdminPanel from '../components/AdminPanel';

const authLink = setContext((_, { headers }) => {
  const userData = JSON.parse(localStorage.getItem('user') || '{}');
  return {
    headers: {
      ...headers,
      authorization: userData.token ? `Bearer ${userData.token}` : '',
    }
  };
});

const httpLink = new HttpLink({
  uri: process.env.REACT_APP_GRAPHQL_ENDPOINT || "/query",
});

const client = new ApolloClient({
  link: from([authLink, httpLink]),
  cache: new InMemoryCache(),
});

const AdminPage: React.FC = () => {
  const [adminPassword, setAdminPassword] = useState('');
  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState(false);
  const [showPasswordPrompt, setShowPasswordPrompt] = useState(true);
  const navigate = useNavigate();

  const handlePasswordSubmit = () => {
    if (adminPassword === 'admin') {
      setIsAdminAuthenticated(true);
      setShowPasswordPrompt(false);
      setAdminPassword('');
      toast.success('Admin access granted!');
    } else {
      toast.error('Incorrect admin password');
      setAdminPassword('');
    }
  };

  const handlePasswordCancel = () => {
    navigate('/');
  };

  const handleBackToHome = () => {
    navigate('/');
  };

  return (
    <ApolloProvider client={client}>
      <div className='min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50'>
        {showPasswordPrompt && (
          <div className='fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4'>
            <div className='bg-white/90 backdrop-blur-md rounded-3xl p-6 lg:p-8 border border-white/30 shadow-2xl max-w-md w-full'>
              <div className='text-center mb-8'>
                <div className='w-20 h-20 bg-gradient-to-r from-purple-500 to-blue-500 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-2xl'>
                  {React.createElement(MdAdminPanelSettings as React.ComponentType<any>, { className: 'text-white text-3xl' })}
                </div>
                <h3 className='text-2xl font-bold text-gray-800 mb-3'>Admin Access Required</h3>
                <p className='text-gray-600 text-base'>Enter the admin password to access the admin panel</p>
              </div>
              
              <div className='space-y-6'>
                <input
                  type='password'
                  placeholder='Enter admin password'
                  value={adminPassword}
                  onChange={(e) => setAdminPassword(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handlePasswordSubmit()}
                  className='w-full px-4 py-3 bg-white/80 backdrop-blur-md border border-white/30 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-transparent transition-all duration-300 text-gray-700 hover:border-gray-400'
                  autoFocus
                />
                
                <div className='flex flex-col sm:flex-row gap-3'>
                  <button
                    onClick={handlePasswordCancel}
                    className='flex-1 px-4 py-3 bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-xl transition-all duration-200 font-semibold'
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handlePasswordSubmit}
                    className='flex-1 px-4 py-3 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white rounded-xl transition-all duration-200 font-semibold shadow-lg hover:shadow-xl transform hover:scale-[1.02]'
                  >
                    Access Admin
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {isAdminAuthenticated && (
          <div className='flex flex-col h-screen'>
            {/* Header */}
            <div className='bg-white/80 backdrop-blur-md border-b border-white/30 shadow-lg p-4 lg:p-6'>
              <div className='flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 max-w-7xl mx-auto'>
                <div className='flex items-center gap-4'>
                  <div className='w-14 h-14 bg-gradient-to-r from-purple-500 to-blue-500 rounded-2xl flex items-center justify-center shadow-lg'>
                    {React.createElement(MdAdminPanelSettings as React.ComponentType<any>, { className: 'text-white text-2xl' })}
                  </div>
                  <div>
                    <h1 className='text-2xl lg:text-3xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent'>
                      Admin Panel
                    </h1>
                    <p className='text-gray-600 text-sm lg:text-base'>Manage users and files across the platform</p>
                  </div>
                </div>
                
                <button
                  onClick={handleBackToHome}
                  className='flex items-center gap-2 px-4 py-3 bg-white/60 hover:bg-white/80 text-gray-700 rounded-xl transition-all duration-200 font-semibold backdrop-blur-sm border border-white/30 shadow-md hover:shadow-lg'
                >
                  {React.createElement(MdArrowBack as React.ComponentType<any>, { className: 'text-lg' })}
                  Back to Home
                </button>
              </div>
            </div>

            {/* Main Content */}
            <div className='flex-1 overflow-auto'>
              <div className='max-w-7xl mx-auto p-4 lg:p-6'>
                <AdminPanel isAuthenticated={isAdminAuthenticated} />
              </div>
            </div>

            {/* Footer */}
            <div className='bg-white/60 backdrop-blur-md border-t border-white/30 p-4'>
              <div className='max-w-7xl mx-auto text-center'>
                <div className='flex items-center justify-center gap-2 text-gray-600'>
                  {React.createElement(MdCloud as React.ComponentType<any>, { className: 'text-lg' })}
                  <span className='text-sm lg:text-base font-medium'>FileVault Admin Panel - Manage your cloud storage</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </ApolloProvider>
  );
};

export default AdminPage;
