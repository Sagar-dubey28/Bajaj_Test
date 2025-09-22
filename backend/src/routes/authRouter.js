import express from "express";
import { Register, Login, Logout } from "../controller/authController.js";

const router = express.Router();

router.post("/register", Register);
router.post("/login", Login);
router.get("/logout", Logout);

// protect middleware ki help se jwt token ko verify kr linge ,
//  jb user profile or dashboard ,order vale route pr jaega tb protect middleware kam aega.'


export default router;
