import express from 'express'
import cors from 'cors'
import dotenv from "dotenv"
import connectDB from './DB/connectDB.js'
import userRoutes from './Routes/userRoutes.js'
import cookieParser from "cookie-parser";
import { dirname, join, resolve } from 'path';
import { fileURLToPath } from 'url';
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
import {v2 as cloudinary} from "cloudinary"

// console.log(resolve(__dirname,'../Frontend','dist'));
const app=express()

app.use(cors({
    credentials:true,
    origin:'http://localhost:5173'
}))
dotenv.config()
cloudinary.config({
    cloud_name:process.env.CLOUDINARY_NAME,
    api_key:process.env.CLOUDINARY_API_KEY,
    api_secret:process.env.CLOUDINARY_API_SECRET
  })
  app.use(express.json({limit:'50mb'}))
  app.use(cookieParser())
app.use(express.urlencoded({extended:true}))

const port=process.env.PORT || 4000

app.use('/api/users',userRoutes)
app.use('/upload',express.static(__dirname+'/Uploads'))
app.use(express.static(join(__dirname,"../Frontend/dist")))
// app.get("*", (req,res)=>{
//     res.sendFile(resolve(__dirname,"../Frontend","dist","index.html"))
// })
app.listen(port,()=>{
    connectDB()
    console.log(`Listening to ${port}`);
})