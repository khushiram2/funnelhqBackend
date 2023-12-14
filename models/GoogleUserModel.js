import mongoose from "mongoose";


const googleUserSchema=new mongoose.Schema({
    name:{type:String},
    image:{type:String},
    googleId:{
        type:String,
        required:true,
        unique:true
    }
},{timestamps:true})

export const GoogleUserModel=mongoose.model("googleuser",googleUserSchema)