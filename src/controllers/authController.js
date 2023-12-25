import dotenv from "dotenv";
import express from "express";
import jwt from "jsonwebtoken";
import fs from "fs/promises";
import bcrypt from "bcryptjs";
import { serialize } from "cookie";

dotenv.config();

const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET;

router.post("/login", async (req, res) => {
  const { username, password } = req.body;
  const userData = await fs.readFile("users.json", "utf8");
  const users = JSON.parse(userData);
  const user = users.find((users) => users.username === username);

  if (!JWT_SECRET) {
    throw new Error("JWT_SECRET is not defined in the environment variables.");
  }

  if (user && bcrypt.compareSync(password, user.password)) {
    const token = jwt.sign({ id: user.id }, JWT_SECRET, {
      expiresIn: "30d",
    });

    const serialized = serialized("JWTToken", token, {
      httpOnly: true,
      maxAge: 60 * 60 * 24 * 30,
      secure: false,
      path: "/",
    });
    res.setHeader("set-cookie", serialized);
    return res.status(200).json({token});
  }
  res.status(401).json({
    error:{
        type: "info",
        message: "username or password is incorrect."
    },
  });
});


router.get("/logout", (req, res) => {
    const {cookies} = req;
    const jwt = cookies?.JWTToken;
if(!jwt) {
    return res.json({
        message: "already logged out.",
    });
}


const serialized =serialize("JWTToken", "", {
    httpOnly: true,
    secure: false,
    maxAge: -1,
    path: "/",
})
res.setHeader("setCookie", serialized);
res.status(200).json({message:"successfully logged out"});
})


export default router;
