import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useRecoilValue } from 'recoil';
import userAtom from '../../atoms/userAtom';

const MyPlaces = () => {
    const [places, setPlaces] = useState([]);
    const user=useRecoilValue(userAtom)
    useEffect(() => {
        const fetchPlaces = async () => {
            try {
                const res = await axios.post('https://gofindbackend.onrender.com/api/users/myPlaces', {id:user._id}, {
                    headers: {
                        'Accept': 'application/json',
                        'Content-Type': 'application/json'
                    },
                    withCredentials: true
                });
                // console.log(res.data);
                setPlaces(res.data.places); // Assuming res.data.places is the list of places
            } catch (error) {
                alert(error.response.data.error)
                console.error(error);
            }
        };

        fetchPlaces();
    }, []);
    const deletePlace=async(id)=>{
        try {
            const res=await axios.delete(`https://gofindbackend.onrender.com/api/users/delete/${id}`,{},{
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                withCredentials: true
            })
            // console.log(res.data);
            alert(res.data.message)
        } catch (error) {
            alert(error.response.data.error)
                console.error(error);
        }
    }
    return (
        <div>
            <div className="py-3 text-center">
                <Link className='inline-flex gap-1 bg-primary text-white py-2 px-6 rounded-full' to={'/account/place/new'}>
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                    </svg>
                    Add new Place
                </Link>
            </div>
            <div className='mt-4'>
                {places.map((place) => (
                    <div key={place._id} className="cursor-pointer flex gap-4 mt-2 min-h-40 bg-gray-200 rounded-2xl p-4">
                        <Link to={'/account/places/' + place._id} className="max-h-32 max-w-32 grow shrink-0">
                            {place.photos.length > 0 && (
                                <img className='h-32 w-32 object-contain rounded-2xl' src={ place.photos[0]} alt="" />
                            )}
                        </Link>
                        <div className="w-full grow-0 shrink">
                                <div className=" flex justify-between w-full">
                                    <Link to={'/account/places/' + place._id}>
                                        <h2 className="text-xl cursor-pointer">{place.title}</h2>
                                    </Link>
                                    <div className='flex gap-2'>

                                    <Link to={'/account/place/edit/' + place._id}>
                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10" />
                                        </svg>
                                    </Link>
                                    <Link to={'/account/place'}>
                                    <svg onClick={()=>deletePlace(place._id)} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="size-6">
  <path fillRule="evenodd" d="M16.5 4.478v.227a48.816 48.816 0 0 1 3.878.512.75.75 0 1 1-.256 1.478l-.209-.035-1.005 13.07a3 3 0 0 1-2.991 2.77H8.084a3 3 0 0 1-2.991-2.77L4.087 6.66l-.209.035a.75.75 0 0 1-.256-1.478A48.567 48.567 0 0 1 7.5 4.705v-.227c0-1.564 1.213-2.9 2.816-2.951a52.662 52.662 0 0 1 3.369 0c1.603.051 2.815 1.387 2.815 2.951Zm-6.136-1.452a51.196 51.196 0 0 1 3.273 0C14.39 3.05 15 3.684 15 4.478v.113a49.488 49.488 0 0 0-6 0v-.113c0-.794.609-1.428 1.364-1.452Zm-.355 5.945a.75.75 0 1 0-1.5.058l.347 9a.75.75 0 1 0 1.499-.058l-.346-9Zm5.48.058a.75.75 0 1 0-1.498-.058l-.347 9a.75.75 0 0 0 1.5.058l.345-9Z" clipRule="evenodd" />
</svg>
                                    </Link>
                                    </div>
                                </div>
                            <p className='text-sm mt-2'>{place.description}</p>
                            <p className='text-sm mt-2'>₹{place?.price}/Night</p>
                            {place.perks.length>0 && (place.perks.map((item,id)=>{
                                return <span key={id} className='gap-2 mt-2'>{item} {item===place.perks[place.perks.length-1]?'':'•'} </span>}
                            ))}

                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default MyPlaces;
