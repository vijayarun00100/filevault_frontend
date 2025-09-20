import React from 'react'

const Authentication = () => {
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
            <div className='flex flex-row gap-2 mt-2 p-2 justify-center items-center'>
              <h1>username :</h1>
              <input type="text" placeholder='enter username ' className='border-2 border-solid border-black rounded-2xl p-2'/>
            </div>
            <div className='flex flex-row gap-2 mt-5 justify-center items-center'>
              <h1>password :</h1>
              <input type="password" placeholder='password' className='border-2 border-solid border-black rounded-2xl p-2'/>
            </div>
            <div className='flex gap-2 mt-5 justify-center items-center'>
              <div className='w-24'></div>
              <button className='bg-blue-500 text-white p-3 rounded-2xl'>Login</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Authentication