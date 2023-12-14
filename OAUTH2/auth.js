import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import { GoogleUserModel } from "../models/GoogleUserModel.js";

export const passportConnection=()=>{
    
passport.use(new GoogleStrategy({
    clientID:process.env.GOOGLE_CLIENTID ||"my client id",
    clientSecret:process.env.GOOGLE_CLIENT_SECRET||"my client secret",
    callbackURL:"http://localhost:4040/google/frontend"
},
async function(accessToken,refreshToken,profile,done){
const user= await GoogleUserModel.findOne({googleId:profile.id});
if(!user){
const newuser=await GoogleUserModel.create({
    googleId:profile.id,
    name:profile.displayName,
    image:profile.photos[0].value,
})
return done(null,newuser)
}else{
    done(null,user)
}
}))


passport.serializeUser((user,done)=>{
    done(null,user.googleId)
})

passport.deserializeUser(async (id,done)=>{
    const user=await GoogleUserModel.findOne({googleId:id})
    done(null,user)
})
}


