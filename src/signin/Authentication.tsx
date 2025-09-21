import React, { useState } from 'react';
import { ApolloClient, HttpLink, InMemoryCache, gql } from "@apollo/client";
import { ApolloProvider, useMutation } from "@apollo/client/react";
import { useNavigate } from 'react-router-dom';
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { MdEmail, MdLock, MdLogin, MdCloud, MdArrowBack } from 'react-icons/md';
interface LoginResponse {
  login: {
    token: string;
    user: {
      id: string;
      name: string;
      email: string;
    };
  };
}
;

const client = new ApolloClient({
  link: new HttpLink({ 
    uri: "/query",
  }),
  cache: new InMemoryCache(),
});

const LOGIN_MUTATION = gql`
  mutation Login($email: String!, $password: String!) {
    login(email: $email, password: $password) {
      token
      user {
        id
        name
        email
      }
    }
  }
`;
const notifyError = (message: string) => {
  toast.error(message);
};

const notifySuccess = (message: string) => {
  toast.success(message);
};


const LoginForm = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [login, { data, loading, error }] = useMutation<LoginResponse>(LOGIN_MUTATION);
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const result = await login({
        variables: {email , password}
      })
      console.log('Login successful:', result.data);
      
      if (result.data?.login?.token) {
        localStorage.setItem('authToken', result.data.login.token);
        localStorage.setItem('user', JSON.stringify(result.data.login.user));
        
        notifySuccess(`Welcome back, ${result.data.login.user.name}!`);
        navigate('/main');
      }
    } catch (err) {
      console.error('Login failed:', err);
      notifyError(`Login failed. ${error?.message}`);
    }
  };

  return (
    <div className='min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex items-center justify-center p-4'>
      <div className='max-w-4xl w-full'>
        <div className='mb-6'>
          <button 
            onClick={() => navigate('/')}
            className='flex items-center gap-2 text-gray-600 hover:text-gray-800 transition-colors'
          >
            {React.createElement(MdArrowBack as React.ComponentType<any>, { className: 'text-xl' })}
            Back to Home
          </button>
        </div>
        <div className='bg-white/70 backdrop-blur-sm rounded-3xl shadow-2xl border border-white/20 overflow-hidden'>
          <div className='grid md:grid-cols-2 min-h-[600px]'>
            <div className='bg-gradient-to-br from-blue-600 to-purple-600 p-12 flex flex-col justify-center items-center text-white relative overflow-hidden'>
              <div className='absolute inset-0 bg-black/10'></div>
              <div className='relative z-10 text-center'>
                <div className='w-20 h-20 bg-white/20 rounded-2xl flex items-center justify-center mx-auto mb-8 backdrop-blur-sm'>
                  {React.createElement(MdCloud as React.ComponentType<any>, { className: 'text-4xl text-white' })}
                </div>
                <h1 className='text-4xl font-bold mb-4'>FileVault</h1>
                <p className='text-blue-100 text-lg leading-relaxed'>
                  A safe place to store & retrieve your files !!
                </p>
                <div className='mt-8 space-y-3'>
                  <div className='flex items-center gap-3 text-blue-100'>
                    <div className='w-2 h-2 bg-blue-200 rounded-full'></div>
                    <span>End-to-end encryption</span>
                  </div>
                  <div className='flex items-center gap-3 text-blue-100'>
                    <div className='w-2 h-2 bg-blue-200 rounded-full'></div>
                    <span>Lightning fast uploads</span>
                  </div>
                  <div className='flex items-center gap-3 text-blue-100'>
                    <div className='w-2 h-2 bg-blue-200 rounded-full'></div>
                    <span>Access from anywhere</span>
                  </div>
                </div>
              </div>
            </div>  
            <div className='p-12 flex flex-col justify-center'>
              <div className='max-w-sm mx-auto w-full'>
                <h2 className='text-3xl font-bold text-gray-800 mb-2'>Sign In</h2>
                <p className='text-gray-600 mb-8'>Welcome back! Please sign in to your account.</p>
                <form onSubmit={handleLogin} className='space-y-6'>
                  <div>
                    <label className='block text-sm font-medium text-gray-700 mb-2'>Email Address</label>
                    <div className='relative'>
                      <div className='absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none'>
                        {React.createElement(MdEmail as React.ComponentType<any>, { className: 'text-gray-400' })}
                      </div>
                      <input 
                        type="email" 
                        placeholder='Enter your email'
                        className='w-full pl-12 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all duration-200 bg-gray-50 focus:bg-white'
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                      />
                    </div>
                  </div>
                  <div>
                    <label className='block text-sm font-medium text-gray-700 mb-2'>Password</label>
                    <div className='relative'>
                      <div className='absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none'>
                        {React.createElement(MdLock as React.ComponentType<any>, { className: 'text-gray-400' })}
                      </div>
                      <input 
                        type="password" 
                        placeholder='Enter your password'
                        className='w-full pl-12 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all duration-200 bg-gray-50 focus:bg-white'
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                      />
                    </div>
                  </div> 
                  <button 
                    type="submit" 
                    className='w-full flex items-center justify-center gap-3 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white py-3 px-6 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none'
                    disabled={loading}
                  >
                    {loading ? (
                      <>
                        <div className='w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin'></div>
                        Signing In...
                      </>
                    ) : (
                      <>
                        {React.createElement(MdLogin as React.ComponentType<any>, { className: 'text-xl' })}
                        Sign In
                      </>
                    )}
                  </button>
                </form>                
                {error && (
                  <div className='mt-4 p-4 bg-red-50 border border-red-200 rounded-xl'>
                    <p className='text-red-600 text-sm'>Error: {error.message}</p>
                  </div>
                )}                
                {data?.login && (
                  <div className='mt-4 p-4 bg-green-50 border border-green-200 rounded-xl'>
                    <p className='text-green-600 text-sm'>Welcome, {data.login.user.name}!</p>
                  </div>
                )}
                <div className='mt-8 text-center'>
                  <p className='text-gray-500 text-sm'>
                    Created by vijayarun :)
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const Authentication = () => {
  return (
    <ApolloProvider client={client}>
      <LoginForm />
    </ApolloProvider>
  );
}

export default Authentication