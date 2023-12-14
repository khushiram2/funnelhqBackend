import { userModel } from "../models/userModel.js";
import jwt from "jsonwebtoken"


export const verifyToken = async (req, res, next) => {
    console.log(req.cookie)
    console.log(req.cookies)
  const accessToken = req.cookies.accessToken;
  const refreshToken = req.cookies.refreshToken;
  if (!accessToken || !refreshToken) return res.status(401).send({success:false,message:'Please sign in.'});
  try {
    const decodedAccessToken = jwt.verify(accessToken, process.env.JWT_SECRET_KEY);
    req.user = getUserFromAccessToken(decodedAccessToken);
    next();
  } catch (accessTokenError) {
    if (accessTokenError.name === 'TokenExpiredError' && accessTokenError.message.includes('access')) {
      try {
        const decodedRefreshToken = jwt.verify(refreshToken, process.env.JWT_SECRET_KEY);
        const user = await userModel.findOne({refreshToken:refreshToken});
        if (!user || user._id !== decodedRefreshToken.id) return res.status(401).send({success:false,message:'Please sign in.'});
        const { accessToken: newAccessToken, genRefreshToken: newRefreshToken } = await user.saveToken(user._id);
        await user.save();
        res.cookie('accessToken', newAccessToken, { httpOnly: true });
        res.cookie('refreshToken', newRefreshToken, { httpOnly: true });
        req.user = user;
        next();
      } catch (refreshTokenError) {
        res.status(401).send({success:false,message:'Please sign in.'});
      }
    } else {
      res.status(401).send({success:false,message:'Please sign in.'});
    }
  }
};

  
  