import { userModel } from "../models/userModel.js";
import bcrypt from "bcryptjs"
export const registerController = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    if (!name || !email || !password)
      return res.status(400).send({success:false,message:"Missing required fields"});
    const user = new userModel({
      name,
      email,
      password,
    });
    const saved = await user.save();
    if (!saved) return res.status(301).send({success:false,message:"couldn't save the user"});
    const { accessToken,genRefreshToken : refreshToken } = await user.saveToken(saved._id);
    const refreshTokenSaved = await user.save();
    if(!refreshTokenSaved) return res.status(301).send({success:false,message:"couldn't save the token"})
    res.cookie("accessToken", accessToken, { httpOnly: true,secure:false,sameSite:"None" });
    res.cookie("refreshToken", refreshToken, { httpOnly: true,secure:false ,sameSite:"None" });
    res
      .status(200)
      .send({
        success:true,
        message: "user registered sucessfully",
        data: { name: saved.name, email: saved.email },
      });
  } catch (error) {
    console.log(error);
    res.status(500).send({success:false,message:"internal server error"});
  }
};

export const logincontroller= async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await userModel.findOne({ email });
    if (!user) return res.status(401).send({success:false,message:"Invalid email or password"});
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid)
      return res.status(401).send({success:true,message:"Invalid email or password"});
    const { accessToken,genRefreshToken: refreshToken } = await user.saveToken(user._id);
    const refreshTokenSaved= await user.save();
    if(!refreshTokenSaved)
    return res.status(401).send({success:false,message:"Couldn't save the token"})
    res.cookie("accessToken", accessToken, { httpOnly: true });
    res.cookie("refreshToken", refreshToken, { httpOnly: true });
    res.status(200).send({success:true,message:"Login successful.",data:{name:user.name,email:user.email}});
  } catch (error) {
    res.status(500).send({success:false,message:"Internal Server Error"});
  }
};


export const privateRouteCheck = (req,res) => {
  res.status(200).send({success:true,message:"authorised"})
}

