import jwt from "jsonwebtoken"


const generateTokenCookie=({userId,email},res)=>{
    // const {email,userId}=req.body
    // console.log(userId+" "+email);
    const token=jwt.sign({email,userId},process.env.JWT_SECRET)
    res.cookie("jwt",token,{httpOnly:false,maxAge:15*24*60*60*1000,sameSite: 'strict',secure: process.env.NODE_ENV !== "development"})
    return token
}

export default generateTokenCookie