import express from "express"
import { dbconnection } from "./db/dbconnection.js"
import { userRouter } from "./Routes/userRoutes.js"
import * as dotenv from "dotenv"
import cookieParser from "cookie-parser"
import cors from "cors"
import { googleRouter } from "./Routes/googlrRoutes.js"
import { passportConnection } from "./OAUTH2/auth.js"
import session from "express-session"
import passport from "passport"



dotenv.config()
await dbconnection()
const app=express()
app.use(cors({
    credentials:true,
    origin:"http://localhost:5173"
}))
app.use(session(({
    secret:process.env.SESSION_SECRET,
    resave:false,
    saveUninitialized:false
})))
app.use("/google", passport.authenticate("session"));
app.use(passport.initialize());
app.use(passport.session());
passportConnection()
app.use(express.json())
app.use(cookieParser())
app.use("/google",googleRouter)
app.use("/auth",userRouter)
app.get("/",(_,res)=>{
    res.send("working fine")
})

app.listen(4040,()=>console.log("app started on 4040"))