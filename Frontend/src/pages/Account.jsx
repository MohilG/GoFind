import React, { useState } from 'react'
import { useRecoilValue, useSetRecoilState } from 'recoil'
import userAtom from '../../atoms/userAtom'
import { Link, Navigate, useParams } from 'react-router-dom'
import axios from 'axios'
import Place from './Place'
import Bookings from './Bookings'

const Account = () => {
    const user=useRecoilValue(userAtom)
    const setUser=useSetRecoilState(userAtom)
    let {subpage}=useParams()
    if(!user)return <Navigate to={'/login'}/>
    if(!subpage)subpage='profile'
    // console.log(subpage);
    const logOut=async()=>{
        try {
            const res=await axios.post('https://gofindbackend.onrender.com/api/users/logout',{},{
              headers: {  
                'Accept': 'application/json',
                'Content-Type': 'application/json'
              },
              withCredentials: true
            });
            localStorage.removeItem('userInfo')
            setUser(null)
            
          alert(res.data.message)
          } catch (error) {
              console.log(error);
            alert(error.response.data.error)
          }
    }
     return (
    <div>
        <nav className='w-full flex mt-8 gap-4 justify-center'>
        <Link  className={subpage==='profile'?'bg-primary inline-flex gap-1 text-white rounded-full py-2 px-6 ':'bg-gray-200 rounded-full py-2 inline-flex gap-1 px-6 '} to={'/account/profile'}><svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
  <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z" />
</svg>
My Profile</Link>
            <Link  className={subpage==='booking'?'bg-primary text-white rounded-full inline-flex gap-1 py-2 px-6 ':'bg-gray-200 rounded-full py-2 inline-flex gap-1 px-6 '} to={'/account/booking'}><svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
  <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 6.75h12M8.25 12h12m-12 5.25h12M3.75 6.75h.007v.008H3.75V6.75Zm.375 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0ZM3.75 12h.007v.008H3.75V12Zm.375 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm-.375 5.25h.007v.008H3.75v-.008Zm.375 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z" />
</svg>
My Bookings</Link>
            <Link  className={subpage==='place'?'bg-primary text-white rounded-full py-2 inline-flex gap-1 px-6 ':'bg-gray-200 rounded-full py-2 inline-flex gap-1 px-6 '} to={'/account/place'}><svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
  <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 21v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21m0 0h4.5V3.545M12.75 21h7.5V10.75M2.25 21h1.5m18 0h-18M2.25 9l4.5-1.636M18.75 3l-1.5.545m0 6.205 3 1m1.5.5-1.5-.5M6.75 7.364V3h-3v18m3-13.636 10.5-3.819" />
</svg>
My Accomodations</Link>

        </nav>
        {subpage==='profile' && (
            <div className='text-center max-w-lg mx-auto'>
               Logged in as {user.name} ({user.email})<br />
            <button onClick={()=>logOut()} className=' primary max-w-sm mt-2'>LogOut</button>
            </div>
        )}
        {subpage==='booking' && (
            <Bookings/>
        )}
        {subpage==='place' && (
            <Place/>
        )}
    </div>
  )
}

export default Account