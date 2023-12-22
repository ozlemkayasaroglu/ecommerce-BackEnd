import express from "express";
import fs from "fs";
import path, { dirname, resolve } from "path";
import { fileURLToPath } from "url";

const router = express.Router();

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const productDataPath = path.join(__dirname, "..", "data", "products.json");

// tüm ürünleri listele
router.get("/", async (request, response) => {
  getProducts()
    .then((products) => response.json(products))
    .catch((error) => response.status(401).json(error));
});

// tek bir ürünü listele
router.get("/:id", async (request, response) => {
  const products = await getProducts();
  const productId = parseInt(request.params.id);
  const product = findProduct(productId, products);

  product
    ? response.json(product)
    : response.status(401).json({ message: "ürün bulunamadı." });
});

// yeni ürün oluştur
router.post("/", async (request, response) => {
  try {
    const products = await getProducts();
    const newId = generateProductId(products);

    const newProduct = {
      id: newId,
      image: request.body.image,
      name: request.body.name,
      category: request.body.category,
      price: request.body.price,
      description: request.body.description,
      features: request.body.features,
    };

    await addProducts(newProduct, products);
    response.json({ message: "ürün başarıyla kaydedildi" });
  } catch (error) {
    response.status(401).json({ message: "ürün ekleme sırasında hata oluştu" });
  }
});

// bir ürünü güncelle
router.put("/:id", async (request, response) => {
  try {
    const products = await getProducts();
    let isFind = false;

    const newProducts = products.map((item) => {
      if (item.id === parseInt(request.params.id)) {
        isFind = true;
        item.image = request.body.image;
        item.name = request.body.name;
        item.category = request.body.category;
        item.price = request.body.price;
        item.description = request.body.description;
        item.features = request.body.features;
      }
      return item;
    });
    if (!isFind) {
      return response.json({ message: "ürün bulunamadı" });
    }

    await saveProducts(newProducts);
    response.json({ message: "ürün başarıyla güncellendi" });
  } catch (error) {
    response.status(401).json({ message: "ürün güncelleme hatası" });
  }
});

// bir ürün sil
router.delete("/:id", async (request, response) => {
  try {
    const products = await getProducts();


    const deleteProduct = products.filter((item) => {
      if (item.id !== parseInt(request.params.id)) {
return item;
      }
    });
    saveProducts(deleteProduct);
    response.json({ message: "ürün silindi" });
  } catch (error) {
    response.status(401).json({ message: "ürün silme hatası" });
  }
});

const getProducts = () => {
  return new Promise((resolve, reject) => {
    fs.readFile(productDataPath, "utf8", (err, data) => {
      err ? reject(err) : resolve(JSON.parse(data));
    });
  });
};

const findProduct = (productId, products) => {
  return products.find((product) => product.id === productId);
};

const generateProductId = (allProducts) => {
  if (allProducts.length === 0) {
    return 1;
  } else {
    const lastProductId = allProducts[allProducts.length - 1].id;
    return lastProductId + 1;
  }
};

const saveProducts = (newProducts) => {
  return fs.promises.writeFile(
    productDataPath,
    JSON.stringify(newProducts, null, 2)
  );
};

const addProducts = async (newProduct, products) => {
  try {
    products.push(newProduct);

    saveProducts(products)
      .then(() => console.log("ürünü kaydetme/ ekleme başarılı"))
      .catch((error) => console.log("ürün ekleme/kaydetme başarısız"));
  } catch (err) {
    console.error("ürün ekleme başarısız", err);
  }
};

export default router;
