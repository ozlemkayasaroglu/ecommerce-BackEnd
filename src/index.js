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
const productDataPath = path.join(
  __dirname,
  "..",
  "src",
  "data",
  "products.json"
);

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
    await fs.writeFile(userDataPath, JSON.stringify(users, null, 2), (err) => {
      if (err){
        console.error("kullanıcı oluşturulurken dosyaya yazma hatası:", err);
      }
      });

  } catch (err) {
    
  }
};
router.post("/users/", async (req, res) => {
  try {

    //adres kısmı frontendde de büyük bir sıkıntı address.address bölümleri......
    const {image, firstName, lastName, username, phone, age, email, address, company}= req.body;
    const newUser = {
      image,
      firstName,
      lastName,
      username,
      phone,
      age,
      email,
      address,
      company
    }
await addUsers(newUser);
res.json({message: "kullanıcı başarıyla oluşturuldu"});
  } 
  catch (error) {
    console.error("urun yaratma hatası:", error);
    res.status(500).json({error: "urun yaratma işlemi başarısız oldu"})
  }
});


// kullanıcı güncelle

// kullanıcıyı sil

//PRODUCTS

const getProducts = () => {
  return new Promise((resolve, reject) => {
    fs.readFile(productDataPath, "utf8", (err, data) => {
      if (err) {
        reject(err);
      } else {
        resolve(JSON.parse(data));
      }
    });
  });
};

const getProduct = async (id) => {
  const urunler = await getProducts();
  const result = urunler.find((item) => item.id === Number(id));
  return result;
};

// Tüm ürünlerin listesi
router.get("/products", async (req, res) => {
  getProducts()
    .then((data) => {
      res.json(data);
    })
    .catch((err) => {
      res.status(401).end();
    });
});

// tek bir ürün
router.get("/product/:id", async (req, res) => {
  const product = await getProduct(req.params.id);
  if (product) {
    res.json(product);
  } else {
    res.status(404).json({ message: "ürün bulunamadı" });
  }
});

// ÜRÜN EKLEME FONSKİYONU

const addProducts = async (product) => {
  try {
    const products = await getProducts();
    const newProductId = products.length + 1; // lenght 19 + 1. urun ıd sini bulacaksin

    const newProduct = {
      id: newProductId,
      ...product,
    };
    products.push(newProduct);

    await fs.writeFile(
      productDataPath,
      JSON.stringify(products, null, 2),
      () => {}
    );
  } catch (err) {
    console.log(err);
  }
};

// ürün yarat
router.post("/products/", async (req, res) => {
  try {
    const { name, image, description, price, features, category } = req.body;

    const newProduct = {
      image,
      name,
      category,
      price,
      description,
      features,
    };

    await addProducts(newProduct);

    res.json({ message: "Ürün başarıyla oluşturuldu", newProduct });
  } catch (error) {
    console.error("ürün yaratma hatası: ", error);
    res.status(500).json({ error: "ürün yaratma işlemi başarısız oldu." });
  }
});

// GÜNCELLEME FONKSİYONI
const updateProduct = async (id, updatedData) => {
  try {
    const products = await getProducts();

    const productIndex = products.findIndex(
      (product) => product.id === Number(id)
    );

    if (productIndex !== -1) {
      const { name, image, price, category, description, features } =
        updatedData;

      products[productIndex].name = name || products[productIndex].name;
      products[productIndex].image = image || products[productIndex].image;
      products[productIndex].price = price || products[productIndex].price;
      products[productIndex].category =
        category || products[productIndex].category;
      products[productIndex].description =
        description || products[productIndex].description;
      products[productIndex].features =
        features || products[productIndex].features;

      await fs.writeFile(
        productDataPath,
        JSON.stringify(products, null, 2),
        (err) => {
          if (err) {
            console.log(err);
          }
        }
      );
      return true;
    }
    return false;
  } catch (error) {
    console.error("Güncelleme hatası:", error);
    return false;
  }
};

// GÜNCELLEME ROUTER
router.put("/product/:id", (req, res) => {
  const productId = req.params.id;
  const updatedProduct = req.body;
  const isUpdated = updateProduct(productId, updatedProduct);

  if (isUpdated) {
    res.json({ message: "Ürün güncellendi" });
  } else {
    res.status(404).json({ message: "Ürün bulunamadı veya güncellenemedi." });
  }
});

// SİLME FONKSİYONU
const deleteProduct = async (id) => {
  try {
    const products = await getProducts();
    const productIndex = products.findIndex(
      (product) => product.id === Number(id)
    );
    if (productIndex !== -1) {
      products.splice(productIndex, 1);
      await fs.promises.writeFile(
        productDataPath,
        JSON.stringify(products, null, 2)
      );
      return true;
    }
    return false;
    // Ürün bulunamadı
  } catch (error) {
    console.error("ürün silme hatası:", error);
    return false;
  }
};

// bir ürün sil
router.delete("/product/:id", async (req, res) => {
  const id = parseInt(req.params.id);
  const result = await deleteProduct(id);
  if (result) {
    res.json({ message: "ürün silindi" });
  } else {
    res
      .status(404)
      .json({ message: "ürün bulunmadı veya silme işlemi başarısız oldu" });
  }
});

app.use("/", router);

app.listen(3001, () => {
  console.log("3001 portu calısıyor.");
});
