import React from 'react'
import { useSetRecoilState } from 'recoil';
import userAtom from '../../atoms/userAtom';

const LogOut = () => {
    const setUser=useSetRecoilState(userAtom)
    const logout=async(req,res)=>{
        try {
            const res=await axios.post('http://localhost:4000/api/users/logout',{},{
              headers: {  
                'Accept': 'application/json',
                'Content-Type': 'application/json'
              },
              withCredentials: true
            });
            console.log(res)
            localStorage.removeItem('userInfo')
            setUser(null)
            // alert(res.data.message)
          } catch (error) {
              console.log(error.response.data.error);
            alert(error.response.data.error)
          }
    }
  return (
    <div className='mt-4 grow flex items-center justify-around'>
        <div className='mb-64'>
        <h1 className='text-4xl text-center'>LogOut</h1>
        <button className='primary'>Login</button>
            
        </div>
    </div>
  )
}

export default LogOut