import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import Header from './Header'
import axios from 'axios'

const Home = () => {
  const [places,setPlaces]=useState([])
  useEffect(()=>{
    const fetchAll=async()=>{
      try {
        const res = await axios.get('http://localhost:4000/api/users/all', {}, {
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            withCredentials: true
        });
        setPlaces([...res.data.places,...res.data.places,...res.data.places,...res.data.places,...res.data.places,])
        // console.log(res);
        // setPlaces(res.data.places); // Assuming res.data.places is the list of places
    } catch (error) {
        alert(error.response.data.error)
        console.error(error);
    }
    }
    fetchAll()
  },[])
  return (
    <div className='grid gap-6 mt-8 lg:grid-cols-4 md:grid-cols-3 sm:grid-cols-2'>
      {places.map((place,id)=>
      <Link key={id} to={'/account/places/'+place._id}>
        <div className="max-w-sm rounded overflow-hidden shadow-lg" key={id}>
        {place.photos?.[0] && (
          <div className="flex justify-center items-center">
            <img  className=' bg-gray-600 rounded-2xl w-300 aspect-auto ' src={'http://localhost:4000/upload/'+place.photos?.[0]} alt="" />
          </div>
        )}
        <div className="px-6 py-4">
          <div className="font-bold text-xl mb-2">{place.title}</div>
          <p className="text-gray-700 text-base truncate">{place.address}</p>
          <p className="text-gray-700 mt-3 text-base">₹{place.price} /Night</p>
        </div>
        <div className=" px-6  pb-2 truncate">
          {place.perks?.length>0 && place.perks.map((perk,i)=>
          <span key={i} className=" text-sm font-semibold text-gray-700 ">{perk} {perk===place.perks[place.perks.length-1]?'':'•'} </span>
          
        )}

        </div>
      </div>
        </Link>
        )}
  </div>
  )
}

export default Home