import jwt from 'jsonwebtoken'

const protectRoutes=(req,res)=>{
    console.log(req);
    const token = req.cookies;
    console.log(token);
    if(!token)return res.status(404).json({message:"Unauthorized"})
    const decoded=jwt.verify(token,process.env.JWT_SECRET)
    console.log(decoded);
    return
}

export default protectRoutes