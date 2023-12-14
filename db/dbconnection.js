import mongoose from "mongoose";

export const dbconnection = async() => {
    try {
        await mongoose.connect(process.env.MONGODB_URL)
        console.log("connected to db via mongoose");
    } catch (error) {
        console.log(error);
        
    }
}
