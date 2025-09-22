import jwt from "jsonwebtoken";
import User from "../models/userModel.js";

export const Protect = async (req , next) => {
  try {
    const token = req.cookies.BhojanLoginKey;

    const decode = jwt.verify(token, process.env.JWT_SECRET_KEY);

    console.log(decode);
    if (!decode) {
      const error = new Error("Not Authorized, No Token Found");
      error.statusCode = 401;
      throw error;
    }

    const verifiedUser = await User.findById(decode.id);

    if (!verifiedUser) {
      const error = new Error("Not Authorized, Invalid User");
      error.statusCode = 401;
      throw error;
    }

    console.log(verifiedUser);

    req.user = verifiedUser;
    next();
  } catch (error) {
    next(error);
  }
};