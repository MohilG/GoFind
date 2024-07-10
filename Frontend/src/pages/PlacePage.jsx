import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import PlaceGallery from './PlaceGallery'
import Booking from './Booking'

const PlacePage = () => {
    const { id } = useParams() // Destructure to get the id parameter
    const [place, setPlace] = useState({ title: '', photos: [], description: '', address: '', extraInfo: '' }) // Initialize photos as an empty array
    const [currentIndex, setCurrentIndex] = useState(0) // State to track the current index for the carousel

    useEffect(() => {
        const fetchPlace = async () => {
            try {
                const res = await axios.post('http://localhost:4000/api/users/place', { id }, {
                    headers: {
                        'Accept': 'application/json',
                        'Content-Type': 'application/json'
                    },
                    withCredentials: true
                })
                console.log(res.data.place);
                setPlace(res.data.place)
            } catch (error) {
                console.log(error.response?.data?.error || error.message);
                alert(error.response?.data?.error || 'An error occurred')
            }
        }
        fetchPlace()
    }, [id])

  

    return (
      <div className="mt-4 bg-gray-100 -mx-8 px-8 pt-8">
        <h1 className="text-3xl">{place.title}</h1>
        <a href={'https://maps.google.com/?q='+place.address} target='_black'>{place.address}</a>
        <PlaceGallery place={place} />
        <div className="mt-8 mb-8 grid gap-8 grid-cols-1 md:grid-cols-[2fr_1fr]">
          <div className='text-lg'>
            <div className="my-4">
              <h2 className="font-semibold text-2xl">Description</h2>
              {place.description}
            </div>
            <div className="mt-10">
            <span className='font-semibold'>Check-in</span>: {place.checkIn}<br />
             <span className='font-semibold'>Check-out</span>: {place.checkOut}<br />
             <span className='font-semibold'>Max number of guests</span>: {place.maxGuests}
            </div>
          </div>
          <div>
            <Booking place={place} />
          </div>
        </div>
        <div className="bg-white -mx-8 px-8 py-8 border-t">
          <div>
            <h2 className="font-semibold text-2xl">Extra info</h2>
          </div>
          <div className="mb-4 mt-2 text-sm text-gray-700 leading-5">{place.extraInfo}</div>
        </div>
      </div>
    );
  }
  export default PlacePage