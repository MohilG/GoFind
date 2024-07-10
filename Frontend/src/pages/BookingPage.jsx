import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import Dates from './Dates';
import PlaceGallery from './PlaceGallery';

const BookingPage = () => {
  const { id } = useParams();
  console.log(id);
  const [booking, setBooking] = useState(null);
  const [place, setPlace] = useState(null);

  useEffect(() => {
    const fetchBooking = async () => {
      try {
        const res = await axios.post(
          `http://localhost:4000/api/users/mybooking/${id}`,
          {},
          {
            headers: {
              Accept: 'application/json',
              'Content-Type': 'application/json',
            },
            withCredentials: true,
          }
        );
        console.log(res.data);
        const bookingData = res.data.booking;
        setBooking(bookingData);

        // Fetch the place associated with the booking
        const placeRes = await axios.post(
          'http://localhost:4000/api/users/place',
          { id: bookingData.place },
          {
            headers: {
              Accept: 'application/json',
              'Content-Type': 'application/json',
            },
            withCredentials: true,
          }
        );
        console.log(placeRes.data);
        setPlace(placeRes.data.place);
      } catch (error) {
        alert(error.response.data.error);
      }
    };

    fetchBooking();
  }, [id]);

  if (!booking || !place) {
    return <div>Loading...</div>;
  }

  return (
    <div className="my-8">
      <h1 className="text-3xl">{place.title}</h1>
      <a href={'https://maps.google.com/?q='+place.address} target='_blank' className="my-2 underline font-semibold  block">{place.address}</a>
      <div className="bg-gray-200 p-6 my-6 rounded-2xl flex items-center justify-between">
        <div>
          <h2 className="text-2xl mb-4">Your booking information:</h2>
          <Dates booking={booking} />
        </div>
        <div className="bg-primary p-6 text-white rounded-2xl">
          <div>Total price</div>
          <div className="text-3xl">${booking.price}</div>
        </div>
      </div>
      <PlaceGallery place={place} />
    </div>
     );
};

export default BookingPage;
