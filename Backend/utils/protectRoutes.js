import jwt from 'jsonwebtoken'
import User from '../Models/userModel.js';

const protectRoutes=async(req,res,next)=>{
    // console.log(req);
    const token = req.cookies.jwt;
    // console.log(req);
    if(!token)return res.status(404).json({message:"Unauthorized"})
    const decoded=jwt.verify(token,process.env.JWT_SECRET)
    const user=await User.findOne({email:decoded.email}) 
    console.log(user);
    if(user){req.user=user}
    else{return res.status(404).json({message:"Unauthorized"})}
    next()
}

export default protectRoutes