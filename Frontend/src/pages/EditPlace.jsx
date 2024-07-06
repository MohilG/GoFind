import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'

const EditPlace = () => {
    const id=useParams()
    const [place,setPlace]=useState({title:'',description:'',address:'',photos:[],checkIn:'',checkOut:'',maxGuests:0,price:'',perks:[]})
    const [photoL,setPhotoL]=useState('')
    const perks=(e)=>{
        const {name,checked}=e.target
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
                console.log(data);
            setPlace(prevPlace => ({
                ...prevPlace,
                photos: [...prevPlace.photos,...data.fileName]
            }));

        } catch (error) {
            console.error(error);
        }
    };
    const updatePlace=async(e)=>{
        e.preventDefault();
        try {
            const res=await axios.put('http://localhost:4000/api/users/update',place,{
                headers: {  
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                  },
                  withCredentials: true
            })
            console.log(res.data);
            alert(res.data.message)

        } catch (error) {
            console.log(error.response.data.error);
            alert(error.response.data.error)
        }
    }
    const addPhotoByLink=async(e)=>{
        e.preventDefault()

        try {
            const res=await axios.post('http://localhost:4000/api/users/uploadLink',{link:photoL},{
                headers: {  
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                  },
                  withCredentials: true
            })
            // console.log(res);
            setPlace(prevPlace => ({
                ...prevPlace,
                photos: [...prevPlace.photos,res.data.fileName]
            }));
            setPhotoL('')
            alert(res.data.message)
        } catch (error) {
            console.log(error.response.data.error);
      alert(error.response.data.error)
        }
    }
    useEffect(()=>{
        // console.log(id)
        const fetchPlace=async()=>{
            try {
                const res=await axios.post('http://localhost:4000/api/users/place',id,{
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
    },[id])
  return (
    <div>
        <form onSubmit={updatePlace}  >
            <h2 className='text-xl mt-4 px-4' >Title</h2>
            <input type="text" value={place.title} onChange={(e)=>setTitle(e.target.value)} className='text-gray-500 text-sm' />
            <h2 className='text-xl mt-4 px-4' >Address</h2>
            <input type="text" value={place.address} onChange={(e)=>setAddress(e.target.value)} className='text-gray-500 text-sm' />
            <div>
  <h2 className='text-xl mt-4 px-4' >Price/Night</h2>
  <input type="number" value={place.price} 
                   onChange={ev => setPrice(ev.target.value)}/>
          </div>
            <h2 className='text-xl mt-4 px-4' >Photos</h2>
            <div className="flex gap-2">
                <input value={photoL} onChange={(e)=>setPhotoL(e.target.value)} type="text" placeholder='Add using Link' />
                <button className='bg-gray-200 px-4 rounded-2xl' onClick={addPhotoByLink}>Add&nbsp;Photo</button>
            </div>
            <div className="cursor-pointer mt-2 grid items-center gap-2 grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
    {place.photos.length > 0 && place.photos.map((item, _id) => (
        <div className='h-32 flex' key={_id}>
            <img className='h-full w-full object-cover rounded-2xl' src={"http://localhost:4000/upload/" + item} alt="" />
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
<h2 className='text-xl mt-4 px-4' >Description</h2>
<textarea value={place.description} onChange={(e)=>setDesc(e.target.value)} name="" id=""></textarea>
<h2 className='text-xl mt-4 px-4' >Perks</h2>
<div className='grid grid-cols-2 md:grid-cols-3'>
<label className='border p-4 flex rounded-2xl gap-2 items-center'>
 <input type="checkbox" onChange={perks} checked={place.perks.includes('Free Parking')} name='Free Parking' />
<span>Free Parking</span>
    </label>
    <label className='border p-4 flex rounded-2xl gap-2 items-center'>
        <input type="checkbox" onChange={perks} checked={place.perks.includes('TV')}  name='TV' />
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
        <input type="checkbox" onChange={perks} checked={place.perks.includes('Pets Allowed')} name='Pets Allowed'/>
        <span>Pets Allowed</span>
    </label>
    <label className='border p-4 flex rounded-2xl gap-2 items-center'>
        <input type="checkbox" onChange={perks} checked={place.perks.includes('Free Wi-Fi')} name='Free Wi-Fi'/>
        <span>Free Wifi</span>
    </label>
</div>

<h2 className='text-xl mt-4 px-4' >CheckIn & CheckOut </h2>
<div className='grid sm:grid-cols-3 '>
    <div className='flex flex-col gap-2 rounded-2xl items-center'>
        <h3>Check In Time</h3>
        <input value={place.checkIn} onChange={(e)=>setIn(e.target.value)} type="text" placeholder='11:00AM' />
    </div>
    <div className='flex flex-col gap-2 rounded-2xl items-center'>
         
        <h3>Check Out Time</h3>

        <input value={place.checkOut} onChange={(e)=>setOut(e.target.value)} type="text" placeholder='11:00AM' />
    </div>
   
    <div className='flex flex-col gap-2 rounded-2xl items-center'>
    <h3>Number of Guests</h3>

        <input value={place.maxGuests} onChange={(e)=>setG(e.target.value)} type="Number" placeholder='5' />
    </div>
  </div>
 
  <h2 className='text-xl mt-4 px-4' >Extra Info</h2>
<textarea value={place.extraInfo} onChange={(e)=>setInfo(e.target.value)} name="" id="" placeholder='House Rules,etc.'></textarea>

<button className="primary my-4">Save</button>

        </form>
    </div>
  )
}

export default EditPlace