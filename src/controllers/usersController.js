// import express from "express";
// import path, { dirname } from "path";
// import fs from "fs";
// import { fileURLToPath } from "url";

// const router = express.Router();
// const __filename = fileURLToPath(import.meta.url);
// const __dirname = dirname(__filename);
// const userDataPath = path.join(__dirname, "..", "src", "data", "users.json");

// const getUsers = () => {
//   return new Promise((resolve, reject) => {
//     fs.readFile(userDataPath, "utf8", (err, data) => {
//       if (err) {
//         reject(err);
//       } else {
//         resolve(JSON.parse(data));
//       }
//     });
//   });
// };

// router.get("/users", async (req, res) => {
//   const users = await getUsers();
//   request.json(users);
// });

// export default router;
