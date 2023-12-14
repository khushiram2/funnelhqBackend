import {Router} from "express";
import { logincontroller, privateRouteCheck, registerController } from "../controller/authController.js";
import { verifyToken } from "../Middleware/cookiecheck.js";
const router=Router()

router.get("/test",(_,res)=>res.send("test working"))
router.post("/register",registerController)
router.post("/login",logincontroller)
router.get("/privateRoute",verifyToken,privateRouteCheck)
export const userRouter=router