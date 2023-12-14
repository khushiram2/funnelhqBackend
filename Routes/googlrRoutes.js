import { Router } from "express"
import passport from "passport"
const router = Router()

router.get("/login",passport.authenticate("google",{scope:["profile"]}))
router.get("/frontend",passport.authenticate("google",{scope:["profile"],successRedirect:"http://localhost:5173/private/home"}))
router.get("/privateRoute",async(req,res)=>{
if(req.user){
    res.status(200).send({status:true,data:req.user})
}else{
    res.status(200).send({status:false,message:"not authenticated"})
}
}
)

export const googleRouter=router