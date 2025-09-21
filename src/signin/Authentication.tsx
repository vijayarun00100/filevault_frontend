import React, { useState } from 'react'
import { ApolloClient, HttpLink, InMemoryCache, gql } from "@apollo/client";
import { ApolloProvider, useMutation } from "@apollo/client/react";

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

const LoginForm = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [login, { data, loading, error }] = useMutation<LoginResponse>(LOGIN_MUTATION);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const result = await login({
        variables: { email, password }
      });
      console.log('Login successful:', result.data);
    } catch (err) {
      console.error('Login failed:', err);
    }
  };

  return (
    <div className='flex w-full h-screen justify-center items-center bg-gray-300'>
      <div className='flex justify-center items-center bg-gray-100 w-[80%] h-[80%] rounded-2xl p-8 shadow-lg flex-col '>
        <div className='flex flex-row gap-2 mt-2 justify-center items-center border-2 border-black w-full h-full'>
          <div className='border-r-2 border-black w-[50%] h-full'>
            <div className='justify-center items-center h-full flex flex-1 flex-col'>
              <h1 className='text-4xl text-neutral-900 font-medium '>welcome to Vault</h1>
              <h3 className='text-neutral-900 font-medium'>A safe place to store & retrieve your files</h3>
            </div>
          </div>
          <div className='flex flex-col gap-5 mt-2 p-2 justify-center items-center flex-1'>
            <form onSubmit={handleLogin} className='flex flex-col gap-5 items-center'>
              <div className='flex flex-row gap-2 mt-2 p-2 justify-center items-center'>
                <h1>username :</h1>
                <input 
                  type="email" 
                  placeholder='enter email' 
                  className='border-2 border-solid border-black rounded-2xl p-2'
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              <div className='flex flex-row gap-2 mt-5 justify-center items-center'>
                <h1>password :</h1>
                <input 
                  type="password" 
                  placeholder='password' 
                  className='border-2 border-solid border-black rounded-2xl p-2'
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
              <div className='flex gap-2 mt-5 justify-center items-center'>
                <div className='w-24'></div>
                <button 
                  type="submit" 
                  className='bg-blue-500 text-white p-3 rounded-2xl disabled:bg-gray-400'
                  disabled={loading}
                >
                  {loading ? 'Logging in...' : 'Login'}
                </button>
              </div>
              {error && (
                <div className='text-red-500 mt-2'>
                  Error: {error.message}
                </div>
              )}
              {data?.login && (
                <div className='text-green-500 mt-2'>
                  Welcome, {data.login.user.name}!
                </div>
              )}
            </form>
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