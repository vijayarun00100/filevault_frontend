import React from 'react'
import { useState } from 'react'
import { useNavigate} from 'react-router-dom'
import { MdArrowBack, MdCloud, MdLogin } from 'react-icons/md'
import { ApolloClient, HttpLink, InMemoryCache, gql } from "@apollo/client";
import { ApolloProvider, useMutation } from "@apollo/client/react";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
interface RegisterResponse{
    createUser:{
        
        id:string;
        name:string;
        email:string;
        
        
    }
}

const client = new ApolloClient({
    link: new HttpLink({ 
      uri: process.env.REACT_APP_GRAPHQL_ENDPOINT || "/query",
    }),
    cache: new InMemoryCache(),
  });

const REGISTER_MUTATION = gql`
mutation CreateUser($name: String!, $email: String!, $password: String!) {
  createUser(name: $name, email: $email, password: $password) {
    
    id
    name
    email
    
  }
}

`;
function RegisterForm() {
    const navigate = useNavigate();
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [registerUser, {data, loading, error}] = useMutation<RegisterResponse>(REGISTER_MUTATION);

    const handleEvent = async (e: React.FormEvent) => {
        e.preventDefault();
        console.log('Form submitted with:', { name, email, password });
        
        if (!name || !email || !password) {
            toast.error('Please fill in all fields');
            return;
        }
        
        try{
            console.log('Attempting to register user...');
            const result = await registerUser({
                variables:{name , email , password}
            })
            console.log('Registration result:', result);
            
            if(result.data?.createUser?.id){
                localStorage.setItem('user',JSON.stringify(result.data.createUser.id))
                toast.success('User Created ! 👏');
                navigate('/')
            } else {
                console.log('No user data returned');
                toast.error('Registration failed - no user data returned');
            }
        }catch(err){
            console.error('Registration error:', err);
            toast.error('Registration failed: ' + (err instanceof Error ? err.message : 'Unknown error'));
        }
    }

    return(
        <div className='min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex items-center justify-center p-4 flex-col'>
        <div className='max-w-4xl w-full'>
            <div className='mb-6'>
                <button 
                    onClick={() => navigate('/login')}
                    className='flex items-center gap-2 text-gray-600 hover:text-gray-800 transition-colors'
                >
                    {React.createElement(MdArrowBack as React.ComponentType<any>, { className: 'text-xl' })}
                    Back to Sign In
                </button>
            </div>
        </div>
        <div className='bg-white/70 backdrop-blur-sm rounded-3xl shadow-2xl border border-white/20 overflow-hidden w-[50%]'>
            <div className='grid md:grid-cols-2 min-h-[600px]'>
                <div className='bg-gradient-to-br from-blue-600 to-purple-600 p-12 flex flex-col justify-center items-center text-white relative overflow-hidden'>
                    <div className='w-20 h-20 bg-white/20 rounded-2xl flex items-center justify-center mx-auto mb-8 backdrop-blur-sm'>
                        {React.createElement(MdCloud as React.ComponentType<any>, { className: 'text-4xl text-white' })}
                    </div>
                    <h1 className='text-4xl font-bold text-white mb-4'>File Vault</h1>
                    <p className='text-white text-lg'>Store & retrieve your files safely</p>
                </div>
                <div className='p-12 flex flex-col justify-center'>
                    <form onSubmit={handleEvent}>
                        <div className='mb-6 flex flex-row gap-6 text-center items-center'>
                        <p>Name:</p>
                        <input 
                            type="text" 
                            placeholder='Enter your name'
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            className='w-full pl-12 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all duration-200 bg-gray-50 focus:bg-white'
                        />
                        </div>
                        <div className='mb-6 flex flex-row gap-6 text-center items-center'>
                            <p>Email:</p>
                            <input 
                                type="email" 
                                placeholder='Enter your email' 
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className='w-full pl-12 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all duration-200 bg-gray-50 focus:bg-white'
                            />
                        </div>
                        <div className='mb-6 flex flex-row gap-1 text-center items-center'>
                            <p>Password:</p>
                            <input 
                                type="password" 
                                placeholder='Enter your password' 
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className='w-full pl-12 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all duration-200 bg-gray-50 focus:bg-white'
                            />
                        </div>
                        <button 
                            type="submit" 
                            disabled={loading}
                            className='w-full flex items-center justify-center gap-3 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white py-3 px-6 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none'
                        >
                            {React.createElement(MdLogin as React.ComponentType<any>, { className: 'text-xl' })}
                            {loading ? 'Registering...' : 'Register'}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    </div>
    )
}

function Register() {
  return (
   <ApolloProvider client={client}>
        <RegisterForm />
   </ApolloProvider>
  )
}

export default Register