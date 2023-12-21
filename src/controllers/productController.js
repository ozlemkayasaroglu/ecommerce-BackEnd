import { pseudoRandomBytes } from "crypto";
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
  : response.status(401).json({message: "ürün bulunamadı."})
});

// yeni ürün oluştur
router.post("/", async( request, response) => {
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
    features: request.body.features
}





    }catch (error){
        response.status(401).json({message: "ürün ekleme sırasında hata oluştu"})
    }


})



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

const generateProductId= (allProducts) => {
    if(allProducts.length === 0){
        return 1;
    }else {
        const lastProductId= allProducts[allProducts.length-1].id;
        return lastProductId +1;
    }
}

 const saveProducts = (newProducts) => {
    return fs.promises.writeFile(productDataPath, JSON.stringify(newProducts, null,2));
 }


export default router;
