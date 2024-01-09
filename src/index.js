import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import cookieParser from "cookie-parser";


// controllers
import userController from './controllers/userController.js';
import productController from './controllers/productController.js';
import authController from "./controllers/authController.js"

const app = express();

const LOCAL_HOST = process.env.LOCAL_HOST || "http://localhost:3000";

var corsOptions = {
  origin: LOCAL_HOST,
  credentials: true,
  methods: "GET, POST, PUT, DELETE",
  allowedHeaders: "Content-Type, Authorization",
  optionsSuccessStatus: 200,
};
console.log(corsOptions);
app.use(cors(corsOptions));
app.use(cookieParser());
app.use(bodyParser.json());


app.use('/user', userController);
app.use('/product', productController);
app.use("/auth", authController);

app.listen(3001, () => {
  console.log("3001 portu calısıyor.");
});
