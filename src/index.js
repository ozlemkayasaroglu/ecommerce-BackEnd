import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import cookieParser from "cookie-parser";
import productsController from "./controllers/productsController";
import usersController from "./controllers/usersController";

const app = express();
const router = express.Router();

const LOCAL_HOST = process.env.LOCAL_HOST || "http://localhost:3000";
var corsOptions = {
  origin: LOCAL_HOST,
  credentials: true,
  methods: "GET, POST, PUT, DELETE",
  allowedHeaders: "Content Type, Authorization",
  optionsSuccessStatus: 200,
};
app.use(cors());
app.use(bodyParser.json());
app.use(cookieParser());

app.use("/", router);
app.use("/products", productsController);
app.use("/users", usersController);


app.listen(3001, () => {
  console.log("3001 portu calısıyor.");
});
