import bcrypt from 'bcryptjs'
import User from '../Models/userModel.js';
import jwt from 'jsonwebtoken'
import multer from 'multer'
import imageDownLoader from 'image-downloader'
import generateTokenCookie from '../utils/generateCookies.js';
import protectRoutes from '../utils/protectRoutes.js';
import fs from 'node:fs'
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';
import Place from '../Models/placeModel.js';
import Booking from '../Models/bookingModel.js';
import { log } from 'node:console';
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
export const signUp = async(req,res) => {
    // console.log(req.body);
try {
    const {name,email,password} = req.body;
    const user=await User.findOne({email})

    if(user){
return res.status(400).json({error: 'User Already Exists !'})
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword= await bcrypt.hash(password,salt);
    const newUser=new User({
    name,
    email,
    password:hashedPassword
    })
    
    await newUser.save()

    if(newUser){
        
        generateTokenCookie({userId:user._id,email:user.email},res)

    res.status(201).json({_id:newUser._id,name:newUser.name,email:newUser.email,message:"SignUp Successfull"})
    }
    else{
    res.status(400).json({error: 'Invalid User Data !'})

    }

} catch (error) {
    res.status(500).json({error: error.message})
    console.log("Error in Sign Up", error);
}
}
export const login=async(req,res)=>{
    try {
        // console.log('hello');
        const {email,password}=req.body
        const user=await User.findOne({email})
            const isPassword=await bcrypt.compareSync(password,user?.password || "")

            if(!user || !isPassword){
                return res.status(401).json({error:'Invalid Username or Password!'});
            }
            generateTokenCookie({userId:user._id,email:user.email},res)
            
        res.status(201).json({_id:user._id,name:user.name,email:user.email,message:'Login Successfull'})


    } catch (error) {
        res.status(500).json({error: error.message})
        console.log("Error in Login", error);
    }
}

export const logOut=async(req,res)=>{
    try {
        res.cookie('jwt', "" ,{maxAge:1})
        res.status(200).json({ message: "User logged out successfully" });
        }  catch (error) {
            res.status(500).json({message: error.message})
            console.log("Error in Logout", error);
        }
}
// console.log({__dirname});

export const addPhotoByLink=async(req,res)=>{
    try {
        console.log(req.body);
        const { link } = req.body;
        const newName = Date.now() + '.jpg';
        const destDir = join(__dirname, '../Uploads');
        const destPath = join(destDir, newName);
        if(link===''){
            return res.status(400).json({error: 'Invalid Link !'})
        }   
        await imageDownLoader.image({
            url: link,
            dest: destPath
        });

       res.status(200).json({ message: 'Image downloaded successfully' ,fileName:newName  });

    
    }  catch (error) {
            res.status(500).json({message: error.message})
            console.log("Error in add Photo by Link", error);
        }
}
export const photosMiddleware = multer({ dest: join(__dirname, '../uploads/') });

export const uploadPhoto=async(req,res)=>{
    try {
        // console.log(req.files);
        const uploadedFiles=[]
        for(let i=0;i<req.files.length;i++){
            const {path,originalname,filename}=req.files[i]
            const parts=originalname.split('.')
            const ext=parts[parts.length-1]

           const newPath=path+'.'+ext
           fs.renameSync(path,newPath)
           uploadedFiles.push(filename+'.'+ext)
        }
        res.status(200).json({ message: 'Image uploaded successfully' ,fileName:uploadedFiles  })
    } catch (error) {
        res.status(500).json({message: error.message})
        console.log("Error in add Photo ", error);
    }
}

export const myBooking=async(req,res)=>{
    try {
        const {id}=req.body
        // console.log(id);
        if(!id)return res.status(404).json({message:"User Not Found"})
        const bookings=await Booking.find({user:id})
        res.status(200).json({ bookings:bookings })

    } catch (error) {
        res.status(500).json({message: error.message})
        console.log("Error in my booking", error);
    }
}

export const myBookingId=async(req,res)=>{
    try {
        const {id}=req.params
        console.log(id);
        if(!id)return res.status(404).json({message:"Booking Not Found"})
        const booking=await Booking.findById(id)
        res.status(200).json({ booking:booking })

    } catch (error) {
        res.status(500).json({message: error.message})
        console.log("Error in my booking with ID", error);
    }
}
export const bookPlace = async (req, res) => {
    try {
        const { place,guests, checkIn, checkOut, phone, user, price } = req.body;
        // console.log(req.body);
        // Input validation
        if (!place || !checkIn || !checkOut || !phone || !user || !price || !guests) {
            return res.status(400).json({ message: "All fields are required." });
        }

        // Check date validity
        const checkInDate = new Date(checkIn);
        const checkOutDate = new Date(checkOut);
        // console.log(checkInDate+" "+checkOutDate);
        if (checkInDate >= checkOutDate) {
            return res.status(400).json({ message: "Check-out date must be after check-in date." });
        }

        // // Check place availability
        const checkPlace = await Place.findById(place);
        if (!checkPlace) {
            return res.status(404).json({ message: "Place not found." });
        }
        // // Check if the place is already booked for the requested dates
        const existingBooking = await Booking.findOne({
            place,
            $or: [
                { checkIn: { $lt: checkOutDate, $gte: checkInDate } },
                { checkOut: { $lte: checkOutDate, $gt: checkInDate } },
                { checkIn: { $lte: checkInDate }, checkOut: { $gte: checkOutDate } }
            ]
        });

        if (existingBooking) {
            return res.status(409).json({ message: "Place is already booked for the selected dates." });
        }

        // // Create and save the booking
        const newBooking = new Booking({
            place,
            guests,
            checkIn: checkInDate,
            checkOut: checkOutDate,
            phone,
            user,
            price
        });

        await newBooking.save();

        res.status(201).json({ message: "Booking successful!", booking: newBooking });
    } catch (error) {
        res.status(500).json({ message: error.message });
        console.log("Error in booking place", error);
    }
};


export const addPlace=async(req,res)=>{
    try {
        const {title,address,perk,photo,desc,checkIn,checkOut,info,guest,price}=req.body
        // console.log(req.user);
        const newPlace=new Place({owner:req.user._id,title:title,address:address,photos:photo,description:desc,perks:perk,checkIn:checkIn,checkOut:checkOut,maxGuests:guest,extraInfo:info,price:price})
        await newPlace.save()
        res.status(200).json({ message: 'Place added successfully' ,place:newPlace})


    } catch (error) {
        res.status(500).json({message: error.message})
        console.log("Error in add Place ", error);
    }
}

export const myPlace=async(req,res)=>{
    try {
        const myPlaces=await Place.find({owner:req.user._id})
        // console.log(myPlaces); 
        res.status(200).json({ places:myPlaces})


    } catch (error) {
        res.status(500).json({message: error.message})
        console.log("Error in add Place ", error);
    }
}

export const getPlace=async(req,res)=>{
    try {
        const {id}=req.body
        // console.log(id);
        const place=await Place.findById(id)
        if(!place)return res.status(404).json({message:'Place not Found.'})
        res.status(200).json({ place:place})
    } catch (error) {
        res.status(500).json({message: error.message})
        console.log("Error in get Place ", error);
    }
}

export const getAll = async (req, res) => {
    try {
        const places = await Place.find();
        res.status(200).json({ message: "Fetched All Successfully", places: places });
    } catch (error) {
        res.status(500).json({ message: error.message });
        console.error("Error in getting all Place: ", error);
    }
};
export const updatePlace = async (req, res) => {
    try {
        const placeData = req.body;
        const { _id, ...updateData } = placeData;

        const updatedPlace = await Place.findByIdAndUpdate(_id, updateData, { new: true });

        if (!updatedPlace) {
            return res.status(404).json({ message: 'Place not found.' });
        }

        res.status(200).json({ message: "Place updated successfully", place: updatedPlace });
    } catch (error) {
        res.status(500).json({ message: error.message });
        console.error("Error in updatePlace: ", error);
    }
};
export const deletePlace = async (req, res) => {
    try {
        const id = req.params.id;
        const place = await Place.findByIdAndDelete(id);
        if (!place) {
            return res.status(404).json({ message: 'Place not found.' });
            }
        res.status(200).json({ message: "Place deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: error.message });
        console.error("Error in delete Place: ", error);
    }
};