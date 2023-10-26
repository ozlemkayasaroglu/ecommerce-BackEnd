import express from "express";
import path, { dirname } from "path";
import fs from "fs";
import { fileURLToPath } from "url";
import cors from "cors";



const app = express();
const router = express.Router();
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const userDataPath = path.join(__dirname, "..", "src", "data", "users.json");
const productDataPath = path.join(__dirname, "..", "src","data","products.json");

const getUsers = () => {
  return new Promise((resolve, reject) => {
    fs.readFile(userDataPath, "utf8", (err, data) => {
      if (err) {
        reject(err);
      } else {
        resolve(JSON.parse(data));
      }
    });
  });
};

router.get("/users", async (req, res) => {
  const users = await getUsers();
  res.json(users);
});

const getProducts = () => {
  return new Promise ((resolve,reject) =>{
    fs.readFile(productDataPath, "utf8", (err, data) =>{
      if(err) {
        reject(err);
      } else {
        resolve(JSON.parse(data));
      }
    });
  } );
}



router.get("/products", async(req, res)=> {
  const products = await getProducts();
  res.json(products);
})


const LOCAL_HOST= process.env.LOCAL_HOST || "http://localhost:3000";
var corsOptions = {
  origin: LOCAL_HOST,
  credentials: true,
  optionsSuccessStatus: 200,
};

app.use(cors(corsOptions));
app.use("/", router);



app.listen(3001, () => {
  console.log("3001 portu calısıyor.");
});
