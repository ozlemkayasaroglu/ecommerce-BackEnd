import express, { response } from 'express';
import dotenv from "dotenv";
import fs from "fs";
import path, { dirname, resolve } from "path";
import { fileURLToPath } from "url";
import bcrypt from "bcryptjs";


dotenv.config();
const router = express.Router();
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const userDataPath = path.join(__dirname, "..", "data", "users.json");

const JWT_SECRET = process.env.JWT_SECRET;

router.post("/login", async ( request, response) => {
const {username, password} = request.body;

try{
const users= await getUsers();
const user= users.find((user) => user.username === username);

if(!user){
  throw new Error("kullanıcı bulunamadı");
}

if (!JWT_SECRET) {
  throw new Error ("JWT değişkenlerle tanımlanmamış")
}

if(user && bcrypt.compareSync(password, user.password)){
  return response.json({message:"kullanıcı doğrulandı"})
}
response.json();

}catch{
  response.status(500).json({
    message: "kullanıcı giriş hatası"
  })
}
})


const getUsers = () => {
  return new Promise((resolve, reject) => {
    fs.readFile(userDataPath, "utf8", (err,data) => {
      err ? reject(data) : resolve(JSON.parse(data));
    });
  });
};

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