import axios from 'axios'
import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { useRecoilValue, useSetRecoilState } from 'recoil'
import userAtom from '../../atoms/userAtom'

const Login = () => {
    const [email,setEmail]=useState('')
    const [password,setPassword]=useState('')
    const setUser=useSetRecoilState(userAtom)
    const user=useRecoilValue(userAtom)
   const userData=async(e)=>{
    e.preventDefault()
    try {
      const res=await axios.post('https://gofindbackend.onrender.com/api/users/login',{email,password},{
        headers: {  
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
        withCredentials: true
      });
      localStorage.setItem('userInfo',JSON.stringify(res.data))
      setUser(res.data)
      
    alert(res.data.message)
    } catch (error) {
        console.log(error.response.data.error);
      alert(error.response.data.error)
    }
    }
    
  return (
    <div className='mt-4 grow flex items-center justify-around'>
        <div className='mb-64'>
        <h1 className='text-4xl text-center'>Login</h1>
        <form onSubmit={userData} className='max-w-md mx-auto' >
            <input type="email" placeholder='your@email.com' value={email} onChange={(e)=>setEmail(e.target.value)} />
            <input type="password" placeholder='your password' value={password} onChange={(e)=>setPassword(e.target.value)}/>
            <button className='primary'>Login</button>
            <div className='text-center py-2 text-gray-500'>Don't have an Account? <Link className='underline text-black' to='/signup'>Sign Up</Link></div>
        </form>
        </div>
    </div>
  )
}

export default Login