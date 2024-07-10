import { useEffect, useState} from "react";
import {differenceInCalendarDays} from "date-fns";
import axios from "axios";
import {Navigate} from "react-router-dom";
import { useRecoilValue } from "recoil";
import userAtom from "../../atoms/userAtom";

export default function Booking({place}) {
    const user=useRecoilValue(userAtom)
  const [checkIn,setCheckIn] = useState('');
  const [checkOut,setCheckOut] = useState('');
  const [numberOfGuests,setNumberOfGuests] = useState(1);
  const [phone,setPhone] = useState('');
  const [redirect,setRedirect] = useState('');

 
  let numberOfNights = 0;
  if (checkIn && checkOut) {
    numberOfNights = differenceInCalendarDays(new Date(checkOut), new Date(checkIn));
  }

  async function bookThisPlace() {
    const response = await axios.post('http://localhost:4000/api/users/book', {
      checkIn,checkOut,guests:numberOfGuests,user:user._id,phone,
      place,
      price:numberOfNights * place.price*1.05,
    },{
        headers: {  
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
        withCredentials: true
      });
    // console.log( response.data._id);
    alert(response.data.message)
    const bookingId = response.data._id;
    // setRedirect(`/account/bookings/${bookingId}`);
  }

  if (redirect) {
    return <Navigate to={redirect} />
  }

  return (
    <div className="bg-white shadow p-4 rounded-2xl">
      <div className="text-2xl text-center">
        Price: ${place.price} / per night
      </div>
      <div className="border rounded-2xl mt-4">
        <div className="flex">
          <div className="py-3 px-4">
            <label>Check in:</label>
            <input type="date"
                   value={checkIn}
                   onChange={ev => setCheckIn(ev.target.value)}/>
          </div>
          <div className="py-3 px-4 border-l">
            <label>Check out:</label>
            <input type="date" value={checkOut}
                   onChange={ev => setCheckOut(ev.target.value)}/>
          </div>
        </div>
        <div className="py-3 px-4 border-t">
          <label>Number of guests:</label>
          <input type="number"
                 value={numberOfGuests}
                 onChange={ev => setNumberOfGuests(ev.target.value)}/>
        </div>
        {numberOfNights > 0 && (
          <div className="py-3 px-4 border-t">
            
            <label>Phone number:</label>
            <input type="number"
                   value={phone}
                   onChange={ev => setPhone(ev.target.value)}/>
            <div className="my-3 text-gray-500">{place.price}  x  {numberOfNights} Night       <span className=" font-semibold">₹{numberOfNights * place.price}</span></div>
          <div className="my-3 text-gray-500">Extra Charges                                 <span className="font-semibold">₹{numberOfNights * place.price * 0.05}</span></div>
          <div className="my-3 text-gray-500">Total                                          <span className="font-semibold">₹{numberOfNights * place.price * 1.05}</span></div>

        
          
          </div>

        )}
      </div>
      <div>
      
      </div>
      <button onClick={bookThisPlace} className="primary mt-4">
        Book this place
        
      </button>
    </div>
  );
}