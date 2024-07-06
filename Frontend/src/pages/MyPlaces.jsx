import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

const MyPlaces = () => {
    const [places, setPlaces] = useState([]);

    useEffect(() => {
        const fetchPlaces = async () => {
            try {
                const res = await axios.post('http://localhost:4000/api/users/myPlaces', {}, {
                    headers: {
                        'Accept': 'application/json',
                        'Content-Type': 'application/json'
                    },
                    withCredentials: true
                });
                console.log(res.data);
                setPlaces(res.data.places); // Assuming res.data is the list of places
            } catch (error) {
                console.error(error);
            }
        };

        fetchPlaces();
    }, []);

    return (
        <div>
            <div className="py-3 text-center">
                <Link className='inline-flex gap-1 bg-primary text-white py-2 px-6 rounded-full' to={'/account/places/new'}>
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                    </svg>
                    Add new Place
                </Link>
            </div>
            <div className='mt-4'>
                {places.map((place,_id) => (
                    <Link to={'/account/place/'+place._id}    className="cursor-pointer flex gap-4 mt-2 min-h-40 bg-gray-200 rounded-2xl p-4">
                            <div className=" max-h-32 max-w-32 grow shrink-0">
                                {place.photos.length>0 && (
                                    <img className='h-32 w-32 object-contain rounded-2xl' src={"http://localhost:4000/upload/"+place.photos[0]} alt="" />
                                )}
                            </div>
                            <div className="grow-0 shrink">
                                <div className="flex justify-around w-full">
                            <h2 className="text-xl cursor-pointer">{place.title}</h2>
                            <Link to={'/account/places/edit/'+place._id}><svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
  <path strokeLinecap="round" strokeLinejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10" />
</svg>
</Link>
</div>
                            <p className='text-sm mt-2' >{place.description}</p>
                            </div>
                    </Link>// Render each place
                ))}
            </div>
        </div>
    );
};

export default MyPlaces;
