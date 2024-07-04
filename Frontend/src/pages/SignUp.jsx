import axios from 'axios'
import React, { useState } from 'react'
import { Link } from 'react-router-dom'

const SignUp = () => {
  const [name,setName]=useState('')
  const [email,setEmail]=useState('')
  const setUser=useSetRecoilState(userAtom)

    const [password,setPassword]=useState('')
   const userData=async(e)=>{
    e.preventDefault()
    try {
      const res=await axios.post('http://localhost:4000/api/users/signup',{name,email,password},{
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
        <h1 className='text-4xl text-center'>SignUp</h1>
        <form className='max-w-md mx-auto' onSubmit={userData}>
        <input type="text" placeholder='your name' value={name} onChange={(e)=>setName(e.target.value)}/>
            <input type="email" placeholder='your@email.com' value={email} onChange={(e)=>setEmail(e.target.value)}/>
            <input type="password" placeholder='your password' value={password} onChange={(e)=>setPassword(e.target.value)}/>
            <button className='primary'>SignUp</button>
            <div className='text-center py-2 text-gray-500'>Already have an Account? <Link className='underline text-black' to='/login'>Login</Link></div>
        </form>
        </div>
    </div>
  )
}

export default SignUp