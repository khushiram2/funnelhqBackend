import mongoose from "mongoose";
import bcrypt from "bcryptjs"
import jwt from "jsonwebtoken";
const userSchema=new mongoose.Schema({
    name:{type:String,required:true},
    email:{type:String,required:true},
    password:{type:String,required:true},
    refreshToken:{type:String}
},{timestamps:true})

userSchema.pre("save",async function (next){
    if(this.isModified("password")){
     const  hashp= await bcrypt.hash(this.password,10)
       this.password=hashp
    }
    next()
})

userSchema.methods.saveToken= function(id){
    const genRefreshToken= jwt.sign({id},process.env.JWT_SECRET_KEY,{expiresIn:"10d"})
    const accessToken=jwt.sign({id}, process.env.JWT_SECRET_KEY,{expiresIn:"15m"} )
    this.refreshToken=genRefreshToken
    return { accessToken,genRefreshToken}
}

export const userModel=mongoose.model("users",userSchema)

