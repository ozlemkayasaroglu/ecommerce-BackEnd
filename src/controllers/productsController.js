// import express from "express";
// import path, { dirname } from "path";
// import fs from "fs";
// import { fileURLToPath } from "url";
// import { request } from "http";

// const router = express.Router();
// const __filename = fileURLToPath(import.meta.url);
// const __dirname = dirname(__filename);
// const productDataPath = path.join(
//   __dirname,
//   "..",
//   "src",
//   "data",
//   "products.json"
// );

// const getProducts = () => {
//   return new Promise((resolve, reject) => {
//     fs.readFile(productDataPath, "utf8", (err, data) => {
//       if (err) {
//         reject(err);
//       } else {
//         resolve(JSON.parse(data));
//       }
//     });
//   });
// };

// router.get("/products", async (req, res) => {
//     const products = await getProducts();
//     request.json(products);
// })




// export default router;
