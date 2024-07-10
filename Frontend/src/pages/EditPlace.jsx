import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'

const EditPlace = () => {
    const navigate = useNavigate()
    const { id } = useParams()
    const [place, setPlace] = useState({title: '', description: '', address: '', photos: [], checkIn: '', checkOut: '', maxGuests: 0, price: '', perks: []})
    const [photoL, setPhotoL] = useState('')

    const perks = (e) => {
        const {name, checked} = e.target
        setPlace(prevPlace => {
            let updatedPerks;
            if (checked) {
                updatedPerks = [...prevPlace.perks, name];
            } else {
                updatedPerks = prevPlace.perks.filter((p) => p !== name);
            }
    
            return {
                ...prevPlace,
                perks: updatedPerks
            };
        });
        console.log(place.perks);
    }
    
    const uploadPhoto = async (e) => {
        try {
            const files = e.target.files;
            const formData = new FormData();

            for (let i = 0; i < files.length; i++) {
                formData.append('photos', files[i]);
            }

            const res = await axios.post('http://localhost:4000/api/users/upload', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                },
                withCredentials: true
            });

            const { data } = res;
                // console.log(data);
            setPlace(prevPlace => ({
                ...prevPlace,
                photos: [...prevPlace.photos,...data.fileName]
            }));

        } catch (error) {
            console.error(error);
        }
    };

    function removePhoto(filename){
        setPlace(prevPlace => ({
            ...prevPlace,
            photos: prevPlace.photos.filter(photo => photo !== filename)
        }));
        // console.log(photo);
    };

    const updatePlace = async(e) => {
        e.preventDefault();
        try {
            const res = await axios.put('http://localhost:4000/api/users/update', place, {
                headers: {  
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                  },
                  withCredentials: true
            })
            console.log(res.data);
            alert(res.data.message)
            navigate('/account/place/')

        } catch (error) {
            console.log(error.response.data.error);
            alert(error.response.data.error)
        }
    }

    const cover=(filename)=>{
        setPlace(prevPlace => ({
            ...prevPlace,
            photos:[filename,...prevPlace.photos.filter(p=>p!==filename)]
    }))
    console.log(place);
}
    const addPhotoByLink = async(e) => {
        e.preventDefault()

        try {
            const res = await axios.post('http://localhost:4000/api/users/uploadLink', {link: photoL}, {
                headers: {  
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                  },
                  withCredentials: true
            })
            // console.log(res);
            setPlace(prevPlace => ({
                ...prevPlace,
                photos: [...prevPlace.photos, res.data.fileName]
            }));
            setPhotoL('')
            alert(res.data.message)
        } catch (error) {
            console.log(error.response.data.error);
            alert(error.response.data.error)
        }
    }

    useEffect(() => {
        // console.log(id)
        const fetchPlace = async() => {
            try {
                const res = await axios.post('http://localhost:4000/api/users/place', { id }, {
                    headers: {
                        'Accept': 'application/json',
                        'Content-Type': 'application/json'
                    },
                    withCredentials: true
                }) 
                const { data } = res;
                setPlace(data.place);
            

            } catch (error) {
                console.log(error.response.data.error);
                alert(error.response.data.error)
            }
        }
        fetchPlace()
    }, [id])

  return (
    <div>
        <form onSubmit={updatePlace}>
            <h2 className='text-xl mt-4 px-4'>Title</h2>
            <input type="text" value={place.title || ''} onChange={(e) => setPlace({...place, title: e.target.value})} className='text-gray-500 text-sm' />
            
            <h2 className='text-xl mt-4 px-4'>Address</h2>
            <input type="text" value={place.address || ''} onChange={(e) => setPlace({...place, address: e.target.value})} className='text-gray-500 text-sm' />

            <div>
                <h2 className='text-xl mt-4 px-4'>Price/Night</h2>
                <input type="number" value={place.price || ''} onChange={ev => setPlace({...place, price: ev.target.value})}/>
            </div>

            <h2 className='text-xl mt-4 px-4'>Photos</h2>
            {/* <p className='text-sm mt-4 px-4 text-gray-400'>Star Mark the cover photo</p> */}
            <div className="flex gap-2">
                <input value={photoL || ''} onChange={(e) => setPhotoL(e.target.value)} type="text" placeholder='Add using Link' />
                <button className='bg-gray-200 px-4 rounded-2xl' onClick={addPhotoByLink}>Add&nbsp;Photo</button>
            </div> 
            <div className="cursor-pointer mt-2 grid items-center gap-2 grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
                {place.photos.length > 0 && place.photos.map((item, _id) => (
                    <div className='h-32 flex relative' key={_id}>
                        <img className='h-full w-full object-cover rounded-2xl' src={"http://localhost:4000/upload/" + item} alt="" />
                        <div onClick={() => removePhoto(item)} className="absolute bottom-1 right-1 text-white">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                                <path strokeLinecap="round" strokeLinejoin="round" d="m9.75 9.75 4.5 4.5m0-4.5-4.5 4.5M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                            </svg>
                        </div>
                        <div onClick={() => cover(item)} className="absolute bottom-1 left-1 "><svg xmlns="http://www.w3.org/2000/svg" fill={item===place.photos[0]?"orange":"white"} viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
  <path strokeLinecap="round" strokeLinejoin="round" d="M11.48 3.499a.562.562 0 0 1 1.04 0l2.125 5.111a.563.563 0 0 0 .475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 0 0-.182.557l1.285 5.385a.562.562 0 0 1-.84.61l-4.725-2.885a.562.562 0 0 0-.586 0L6.982 20.54a.562.562 0 0 1-.84-.61l1.285-5.386a.562.562 0 0 0-.182-.557l-4.204-3.602a.562.562 0 0 1 .321-.988l5.518-.442a.563.563 0 0 0 .475-.345L11.48 3.5Z" />
</svg>
</div>
                    </div>
                ))} 

                <label className='h-32 flex cursor-pointer gap-1 items-center justify-center border bg-transparent rounded-2xl p-2'>
                    <input type="file" multiple className='hidden' onChange={uploadPhoto} />
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5m-13.5-9L12 3m0 0 4.5 4.5M12 3v13.5" />
                    </svg>
                    Upload
                </label>
            </div>

            <h2 className='text-xl mt-4 px-4'>Description</h2>
            <textarea value={place.description || ''} onChange={(e) => setPlace({...place, description: e.target.value})} name="" id=""></textarea>

            <h2 className='text-xl mt-4 px-4'>Perks</h2>
            <div className='grid grid-cols-2 md:grid-cols-3'>
                <label className='border p-4 flex rounded-2xl gap-2 items-center'>
                    <input type="checkbox" onChange={perks} checked={place.perks.includes('Free Parking')} name='Free Parking' />
                    <span>Free Parking</span>
                </label>
                <label className='border p-4 flex rounded-2xl gap-2 items-center'>
                    <input type="checkbox" onChange={perks} checked={place.perks.includes('TV')} name='TV' />
                    <span>TV</span>
                </label>
                <label className='border p-4 flex rounded-2xl gap-2 items-center'>
                    <input type="checkbox" onChange={perks} checked={place.perks.includes('AC')} name='AC' />
                    <span>AC</span>
                </label>
                <label className='border p-4 flex rounded-2xl gap-2 items-center'>
                    <input type="checkbox" name='Swimming Pool' checked={place.perks.includes('Swimming Pool')} onChange={perks} />
                    <span>Swimming Pool</span>
                </label>
                <label className='border p-4 flex rounded-2xl gap-2 items-center'>
                    <input type="checkbox" name='Wifi' checked={place.perks.includes('Wifi')} onChange={perks} />
                    <span>Wifi</span>
                </label>
                <label className='border p-4 flex rounded-2xl gap-2 items-center'>
                    <input type="checkbox" name='Pets' checked={place.perks.includes('Pets')} onChange={perks} />
                    <span>Pets</span>
                </label>
            </div>

            <div>
                <h2 className='text-xl mt-4 px-4'>Check In</h2>
                <input type="text" value={place.checkIn || ''} onChange={(e) => setPlace({...place, checkIn: e.target.value})} placeholder='14:00'/>
            </div>
            <div>
                <h2 className='text-xl mt-4 px-4'>Check Out</h2>
                <input type="text" value={place.checkOut || ''} onChange={(e) => setPlace({...place, checkOut: e.target.value})} placeholder='22:00'/>
            </div>
            <div>
                <h2 className='text-xl mt-4 px-4'>Max Guests</h2>
                <input type="number" value={place.maxGuests || 0} onChange={(e) => setPlace({...place, maxGuests: e.target.value})} />
            </div>
            <button className='primary'>Update</button>
        </form>
    </div>
  )
}

export default EditPlace
