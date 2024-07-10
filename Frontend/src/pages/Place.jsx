import axios from 'axios'
import React, { useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import MyPlaces from './MyPlaces'

const Place = () => {
    const {action}=useParams()
    // console.log(action);
    const [title, setTitle] = useState('')
    const [address, setAddress] = useState('')
    const [photo, setPhoto] = useState([])
    const [photoL, setPhotoL] = useState('')
    const [desc, setDesc] = useState('')
    const [info, setInfo] = useState('')
    const [perk, setPerk] = useState([])
    const [price, setPrice] = useState(1000)
    const [checkIn, setIn] = useState('')
    const [checkOut, setOut] = useState('')
    const [guest, setG] = useState(0)
    const navigate = useNavigate()

    const addPlace = async (e) => {
        e.preventDefault()
        try {
            const { data } = await axios.post('http://localhost:4000/api/users/add', { title, address, photo, desc, perk, checkIn, checkOut, guest, info, price }, {
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                withCredentials: true
            })
            alert(data.message)
            navigate('/account/place')

        } catch (error) {
            console.log(error.response.data.error);
            alert(error.response.data.error)
        }
    }

    const perks = (e) => {
        const { name, checked } = e.target
        setPerk(prevPerks => {
            if (checked) {
                const updatedPerks = [...prevPerks, name];
                return updatedPerks;
            } else {
                const updatedPerks = prevPerks.filter((p) => p !== name);
                return updatedPerks;
            }
        });
    }

    const addPhotoByLink = async (e) => {
        e.preventDefault()

        try {
            const res = await axios.post('http://localhost:4000/api/users/uploadLink', { link: photoL }, {
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                withCredentials: true
            })
            setPhoto(prev => {
                return [...prev, res.data.fileName]
            })
            setPhotoL('')
            alert(res.data.message)
        } catch (error) {
            console.log(error.response.data.error);
            alert(error.response.data.error)
        }
    }

    const uploadPhoto = async (e) => {
        try {
            const files = e.target.files
            const formData = new FormData()
            for (let i = 0; i < files.length; i++) {
                formData.append('photos', files[i])
            }
            const res = await axios.post('http://localhost:4000/api/users/upload', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                },
                withCredentials: true
            })
            const { data } = res
            setPhoto(prev => {
                return [...prev, ...data.fileName]
            })
        } catch (error) {
            console.log(error.response.data.error);
            alert(error.response.data.error)
        }
    }

    const cover = (filename) => {
        setPhoto(prev => [filename, ...prev.filter(p => p !== filename)]);
    }

    const removePhoto = (filename) => {
        setPhoto((prevPhotos) => prevPhotos.filter(ph => ph !== filename));
    }

    return (
        <div>
            {action !== 'new' && (
                <MyPlaces />
            )}
            {action === 'new' && (
                <form onSubmit={addPlace}>
                    <h2 className='text-xl mt-4 px-4'>Title</h2>
                    <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} className='text-gray-500 text-sm' />
                    <h2 className='text-xl mt-4 px-4'>Address</h2>
                    <input type="text" value={address} onChange={(e) => setAddress(e.target.value)} className='text-gray-500 text-sm' />
                    <div>
                        <h2 className='text-xl mt-4 px-4'>Price/Night</h2>
                        <input type="number" value={price}
                            onChange={ev => setPrice(ev.target.value)} />
                    </div>
                    <h2 className='text-xl mt-4 px-4'>Photos</h2>
                    <div className="flex gap-2">
                        <input value={photoL} onChange={(e) => setPhotoL(e.target.value)} type="text" placeholder='Add using Link' />
                        <button className='bg-gray-200 px-4 rounded-2xl' onClick={addPhotoByLink}>Add&nbsp;Photo</button>
                    </div>
                    <div className="cursor-pointer mt-2 grid items-center gap-2 grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
                        {photo.length > 0 && photo.map((item, _id) => (
                            <div className='h-32 flex relative' key={_id}>
                                <img className='h-full w-full object-cover rounded-2xl' src={"http://localhost:4000/upload/" + item} alt="" />
                                <div onClick={() => removePhoto(item)} className="absolute bottom-1 right-1 text-white">
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="m9.75 9.75 4.5 4.5m0-4.5-4.5 4.5M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                                    </svg>
                                </div>
                                <div onClick={() => cover(item)} className="absolute bottom-1 left-1 ">
                                    <svg xmlns="http://www.w3.org/2000/svg" fill={item === photo[0] ? "orange" : "white"} viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M11.48 3.499a.562.562 0 0 1 1.04 0l2.125 5.111a.563.563 0 0 0 .475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 0 0-.182.557l1.285 5.385a.562.562 0 0 1-.84.61l-4.725-2.885a.562.562 0 0 0-.586 0L6.982 20.54a.562.562 0 0 1-.84-.61l1.285-5.386a.562.562 0 0 0-.182-.557l-4.204-3.602a.562.562 0 0 1 .321-.988l5.518-.442a.563.563 0 0 0 .475-.345L11.48 3.5Z" />
                                    </svg>
                                </div>
                            </div>
                        ))}
                        <label className='h-32 flex cursor-pointer gap-1 items-center justify-center border bg-transparent rounded-2xl p-2 '>
                            <input type="file" multiple className='hidden' onChange={uploadPhoto} />
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5m-13.5-9L12 3m0 0 4.5 4.5M12 3v13.5" />
                            </svg>
                            Upload
                        </label>
                    </div>
                    <h2 className='text-xl mt-4 px-4'>Description</h2>
                    <textarea value={desc} onChange={(e) => setDesc(e.target.value)} name="" id=""></textarea>
                    <h2 className='text-xl mt-4 px-4'>Perks</h2>
                    <div className='grid grid-cols-2 md:grid-cols-3'>
                        <label className='border p-4 flex rounded-2xl gap-2 items-center'>
                            <input type="checkbox" onChange={perks} name='Free Parking' />
                            <span>Free Parking</span>
                        </label>
                        <label className='border p-4 flex rounded-2xl gap-2 items-center'>
                            <input type="checkbox" onChange={perks} checked={perk.includes('TV')} name='TV' />
                            <span>TV</span>
                        </label>
                        <label className='border p-4 flex rounded-2xl gap-2 items-center'>
                            <input type="checkbox" onChange={perks} name='AC' />
                            <span>AC</span>
                        </label>
                        <label className='border p-4 flex rounded-2xl gap-2 items-center'>
                            <input type="checkbox" name='Swimming Pool' onChange={perks} />
                            <span>Swimming Pool</span>
                        </label>
                        <label className='border p-4 flex rounded-2xl gap-2 items-center'>
                            <input type="checkbox" onChange={perks} name='Pets Allowed' />
                            <span>Pets Allowed</span>
                        </label>
                        <label className='border p-4 flex rounded-2xl gap-2 items-center'>
                            <input type="checkbox" onChange={perks} name='Free Wi-Fi' />
                            <span>Free Wifi</span>
                        </label>
                    </div>

                    <h2 className='text-xl mt-4 px-4'>CheckIn & CheckOut </h2>
                    <div className='grid sm:grid-cols-3 '>
                        <div className='flex flex-col gap-2 rounded-2xl items-center'>
                            <h3>Check In Time</h3>
                            <input value={checkIn} onChange={(e) => setIn(e.target.value)} type="text" placeholder='11:00AM' />
                        </div>
                        <div className='flex flex-col gap-2 rounded-2xl items-center'>

                            <h3>Check Out Time</h3>

                            <input value={checkOut} onChange={(e) => setOut(e.target.value)} type="text" placeholder='11:00AM' />
                        </div>

                        <div className='flex flex-col gap-2 rounded-2xl items-center'>
                            <h3>Number of Guests</h3>

                            <input value={guest} onChange={(e) => setG(e.target.value)} type="Number" placeholder='5' />
                        </div>
                    </div>

                    <h2 className='text-xl mt-4 px-4'>Extra Info</h2>
                    <textarea value={info} onChange={(e) => setInfo(e.target.value)} name="" id="" placeholder='House Rules,etc.'></textarea>

                    <button className="primary my-4">Save</button>

                </form>
            )}
        </div>
    )
}

export default Place
