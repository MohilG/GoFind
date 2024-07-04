import express from 'express'
import cors from 'cors'
import dotenv from "dotenv"
import connectDB from './DB/connectDB.js'
import userRoutes from './Routes/userRoutes.js'
import cookieParser from "cookie-parser";
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const app=express()
app.use(cors({
    credentials:true,
    origin:'http://localhost:5173'
}))
dotenv.config()
app.use(express.json())
app.use(cookieParser())
app.use(express.urlencoded({extended:true}))

const port=process.env.PORT || 4000

app.use('/api/users',userRoutes)
app.use('/upload',express.static(__dirname+'/Uploads'))
app.listen(port,()=>{
    connectDB()
    console.log(`Listening to ${port}`);
})