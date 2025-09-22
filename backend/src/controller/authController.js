import User from "../models/userModel.js";
import bcrypt from "bcrypt";
import genToken from "../utils/genAuthToken.js";


export const Register = async (req, res, next) => {
  try {
    const { fullName, email, regNo } = req.body;

    if (!fullName || !email || !regNo) {
      const error = new Error("All Feilds Required");
      error.statusCode = 404;
      return next(error);
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      const error = new Error("User Already Exists, Please Login");
      error.statusCode = 409;
      return next(error);
    }

    const hashedPassword = await bcrypt.hash(regNo, 10);
    
    const newUser = await User.create({
      fullName,
      email,
      regNo: hashedPassword,
    });

    res.status(200).json({
      message: `🙏 Namaste ${fullName}, Apke liye 56 bhog tyar hai 😊`,
    });
  } catch (error) {
    next(error);
  }
};

export const Login = async (req, res, next) => {
  try {
    const { email, regNo } = req.body;

    if (!email || !regNo) {
      const error = new Error("All Feilds Required");
      error.statusCode = 404;
      return next(error);
    }

    const existingUser = await User.findOne({ email });
    if (!existingUser) {
      const error = new Error("User Not Found, Please Register");
      error.statusCode = 404;
      return next(error);
    }

    const isPasswordCorrect = await bcrypt.compare(
      regNo,
      existingUser.regNo
    );
    if (!isPasswordCorrect) {
      const error = new Error("Invalid Credentials");
      error.statusCode = 401;
      return next(error);
    }

    if (!genToken(existingUser._id, res)) {
      const error = new Error("Unable to Login");
      error.statusCode = 403;
      return next(error);
    }

    res.status(200).json({
      message: `Welcome back, ${existingUser.fullName}`,
      data: {
        fullName: existingUser.fullName,
        email: existingUser.email,
      },
    });
  } catch (error) {
    next(error);
  }
};

export const Logout = (req, res, next) => {
  try {
    console.log("Performimg Logout");

    res.clearCookie("BhojanLoginKey");
    console.log("cookies Cleared");

    res.status(200).json({ message: "Logout Successfull" });
  } catch (error) {
    next(error);
  }
};


