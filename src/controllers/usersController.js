import express from "express";
import path, { dirname, resolve } from "path";
import fs from "fs";
import { fileURLToPath } from "url";
import cors from "cors";
import bodyParser from "body-parser";
import cookieParser from "cookie-parser";

const app = express();
const router = express.Router();
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const userDataPath = path.join(__dirname, "..", "src", "data", "users.json");



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


//USERS

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
  
  // tüm kullanıcıların listesi
  router.get("/users", async (req, res) => {
    getUsers()
      .then((data) => {
        res.json(data);
      })
      .catch((err) => {
        res.status(401).end();
      });
  });
  
  // tek bir kullanıcı
  router.get("/users/:id", async (req, res) => {
    const users = await getUsers();
    const userId = parseInt(req.params.id);
  
    const user = users.users.find((user) => user.id === userId);
    if (user) {
      res.json(user);
      console.log(user);
    } else [res.status(404).json({ message: "kullanıcı bulunamadı" })];
  });
  
  // kullanıcı oluşturma
  
  const addUsers = async (user) => {
    try {
      const users = await getUsers();
      const newUserId = users.users.length + 1;
  
      const newUser = {
        id: newUserId,
        ...user,
      };
      users.users.push(newUser);
      await fs.promises.writeFile(
        userDataPath,
        JSON.stringify(users, null, 2),
        (err) => {
          if (err) {
            console.error("kullanıcı oluşturulurken dosyaya yazma hatası:", err);
          }
        }
      );
    } catch (err) {
      console.error("Kullanıcı eklenirken hata:", err);
    }
  };
  
  router.post("/users/", async (req, res) => {
    try {
      const {
        image,
        firstName,
        lastName,
        username,
        phone,
        password,
        email,
        address,
        company,
      } = req.body;
  
      const newUser = {
        image,
        firstName,
        lastName,
        username,
        phone,
        password,
        email,
        address,
        company,
      };
  
      await addUsers(newUser);
      res.json({ message: "kullanıcı başarıyla oluşturuldu" });
    } catch (error) {
      console.error("urun yaratma hatası:", error);
      res.status(500).json({ error: "urun yaratma işlemi başarısız oldu" });
    }
  });
  
  // kullanıcı güncelle
  const updateUser = async (id, updatedUser) => {
    try {
      const userIndex = users.findIndex((user) => user.id === Number(id));
  
      if (userIndex !== -1) {
        const {
          image,
          firstName,
          lastName,
          username,
          password,
          phone,
          age,
          email,
          address,
          company,
        } = updatedUser;
  
          users[userIndex] = {
            ...users[userIndex],
            image,
            firstName,
            lastName,
            username,
            password,
            phone,
            age,
            email,
            address: {
              address: userAddress,
              city: userCity,
            },
            company: {
              address: companyAddress,
              city: companyCity,
              name: companyName,
            },
          };
  
        return { success: true, message: "Kullanıcı başarıyla güncellendi" };
      } else {
        return { success: false, message: "Kullanıcı bulunamadı" };
      }
    } catch (error) {
      return { success: false, message: "Güncelleme sırasında bir hata oluştu" };
    }
  };
  
  // GÜNCELLEME ROUTER
  router.put("/user/:id", (req, res) => {
    const userId = req.params.id;
    const updatedUser = req.body;
    const isUpdated = updateUser(userId, updatedUser);
  
  
    if (isUpdated) {
      res.json({ message: "Ürün güncellendi" });
    } else {
      res.status(404).json({ message: "Ürün bulunamadı veya güncellenemedi." });
    }
  });
  
  // kullanıcıyı sil
  // // SİLME FONKSİYONU
  // const deleteProduct = async (id) => {
  //   try {
  //     const products = await getProducts();
  //     const productIndex = products.findIndex(
  //       (product) => product.id === Number(id)
  //     );
  //     if (productIndex !== -1) {
  //       products.splice(productIndex, 1);
  //       await fs.promises.writeFile(
  //         productDataPath,
  //         JSON.stringify(products, null, 2)
  //       );
  //       return true;
  //     }
  //     return false;
  //     // Ürün bulunamadı
  //   } catch (error) {
  //     console.error("ürün silme hatası:", error);
  //     return false;
  //   }
  // };
  
  // // bir ürün sil
  // router.delete("/product/:id", async (req, res) => {
  //   const id = parseInt(req.params.id);
  //   const result = await deleteProduct(id);
  //   if (result) {
  //     res.json({ message: "ürün silindi" });
  //   } else {
  //     res
  //       .status(404)
  //       .json({ message: "ürün bulunmadı veya silme işlemi başarısız oldu" });
  //   }
  // });
  