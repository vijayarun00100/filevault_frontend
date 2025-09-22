import React from 'react'
import { useState } from 'react'
import { useNavigate} from 'react-router-dom'
import { MdArrowBack, MdCloud, MdLogin, MdPerson, MdEmail, MdLock } from 'react-icons/md'
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
    const [registerUser, {loading}] = useMutation(REGISTER_MUTATION);

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
            
            if(result.data && (result.data as any).createUser?.id){
                localStorage.setItem('user',JSON.stringify((result.data as any).createUser))
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
        <div className='min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex items-center justify-center p-4'>
            <div className='max-w-5xl w-full'>
                <div className='mb-6'>
                    <button 
                        onClick={() => navigate('/login')}
                        className='flex items-center gap-2 text-gray-600 hover:text-gray-800 transition-all duration-200 hover:bg-white/50 px-4 py-2 rounded-xl backdrop-blur-sm'
                    >
                        {React.createElement(MdArrowBack as React.ComponentType<any>, { className: 'text-xl' })}
                        Back to Sign In
                    </button>
                </div>
                <div className='bg-white/80 backdrop-blur-md rounded-3xl shadow-2xl border border-white/30 overflow-hidden'>
                    <div className='grid lg:grid-cols-2 min-h-[650px]'>
                        <div className='bg-gradient-to-br from-blue-600 via-blue-700 to-purple-600 p-8 lg:p-12 flex flex-col justify-center items-center text-white relative overflow-hidden'>
                            <div className='absolute inset-0 bg-black/10'></div>
                            <div className='absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full -translate-y-16 translate-x-16'></div>
                            <div className='absolute bottom-0 left-0 w-24 h-24 bg-white/5 rounded-full translate-y-12 -translate-x-12'></div>
                            <div className='relative z-10 text-center max-w-sm'>
                                <div className='w-24 h-24 bg-white/20 rounded-3xl flex items-center justify-center mx-auto mb-8 backdrop-blur-sm shadow-2xl'>
                                    {React.createElement(MdCloud as React.ComponentType<any>, { className: 'text-5xl text-white' })}
                                </div>
                                <h1 className='text-4xl lg:text-5xl font-bold mb-6 bg-gradient-to-r from-white to-blue-100 bg-clip-text text-transparent'>FileVault</h1>
                                <p className='text-blue-100 text-lg lg:text-xl leading-relaxed mb-8'>
                                    Join thousands of users who trust us with their files
                                </p>
                                <div className='space-y-4'>
                                    <div className='flex items-center gap-4 text-blue-100 bg-white/10 rounded-xl p-3 backdrop-blur-sm'>
                                        <div className='w-3 h-3 bg-blue-200 rounded-full flex-shrink-0'></div>
                                        <span className='text-sm lg:text-base'>Free account creation</span>
                                    </div>
                                    <div className='flex items-center gap-4 text-blue-100 bg-white/10 rounded-xl p-3 backdrop-blur-sm'>
                                        <div className='w-3 h-3 bg-blue-200 rounded-full flex-shrink-0'></div>
                                        <span className='text-sm lg:text-base'>Secure file storage</span>
                                    </div>
                                    <div className='flex items-center gap-4 text-blue-100 bg-white/10 rounded-xl p-3 backdrop-blur-sm'>
                                        <div className='w-3 h-3 bg-blue-200 rounded-full flex-shrink-0'></div>
                                        <span className='text-sm lg:text-base'>Easy file sharing</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className='p-6 lg:p-12 flex flex-col justify-center'>
                            <div className='max-w-sm mx-auto w-full'>
                                <h2 className='text-3xl lg:text-4xl font-bold text-gray-800 mb-3'>Create Account</h2>
                                <p className='text-gray-600 mb-8 text-base lg:text-lg'>Join FileVault and start storing your files securely.</p>
                                <form onSubmit={handleEvent} className='space-y-6'>
                                    <div>
                                        <label className='block text-sm font-medium text-gray-700 mb-2'>Full Name</label>
                                        <div className='relative'>
                                            <div className='absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none'>
                                                {React.createElement(MdPerson as React.ComponentType<any>, { className: 'text-gray-400' })}
                                            </div>
                                            <input 
                                                type="text" 
                                                placeholder='Enter your full name'
                                                value={name}
                                                onChange={(e) => setName(e.target.value)}
                                                className='w-full pl-12 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all duration-200 bg-gray-50 focus:bg-white hover:border-gray-400 text-gray-800'
                                                required
                                            />
                                        </div>
                                    </div>
                                    <div>
                                        <label className='block text-sm font-medium text-gray-700 mb-2'>Email Address</label>
                                        <div className='relative'>
                                            <div className='absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none'>
                                                {React.createElement(MdEmail as React.ComponentType<any>, { className: 'text-gray-400' })}
                                            </div>
                                            <input 
                                                type="email" 
                                                placeholder='Enter your email address' 
                                                value={email}
                                                onChange={(e) => setEmail(e.target.value)}
                                                className='w-full pl-12 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all duration-200 bg-gray-50 focus:bg-white hover:border-gray-400 text-gray-800'
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
                                                placeholder='Create a strong password' 
                                                value={password}
                                                onChange={(e) => setPassword(e.target.value)}
                                                className='w-full pl-12 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all duration-200 bg-gray-50 focus:bg-white hover:border-gray-400 text-gray-800'
                                                required
                                                minLength={6}
                                            />
                                        </div>
                                        <p className='text-xs text-gray-500 mt-2'>Password must be at least 6 characters long</p>
                                    </div>
                                    <button 
                                        type="submit" 
                                        disabled={loading}
                                        className='w-full flex items-center justify-center gap-3 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white py-3 px-6 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none'
                                    >
                                        {loading ? (
                                            <>
                                                <div className='w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin'></div>
                                                Creating Account...
                                            </>
                                        ) : (
                                            <>
                                                {React.createElement(MdLogin as React.ComponentType<any>, { className: 'text-xl' })}
                                                Create Account
                                            </>
                                        )}
                                    </button>
                                </form>
                                <div className='mt-8 text-center'>
                                    <p className='text-gray-500 text-sm'>
                                        Already have an account?{' '}
                                        <button 
                                            onClick={() => navigate('/login')}
                                            className='text-blue-600 hover:text-blue-700 font-medium transition-colors'
                                        >
                                            Sign in here
                                        </button>
                                    </p>
                                </div>
                            </div>
                        </div>
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