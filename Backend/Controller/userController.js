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