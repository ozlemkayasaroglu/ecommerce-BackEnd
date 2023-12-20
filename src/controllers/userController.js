import express from "express";
import path, { dirname, resolve } from "path";
import fs from "fs";
import { fileURLToPath } from "url";
const router = express.Router();

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const userDataPath = path.join(__dirname, "..", "data", "users.json");

// tum kullanicilari listele
router.get("/", async (request, response) => {
  getUsers()
    .then((users) => response.json(users))
    .catch((error) => response.status(401).json(error));
});

// tek bir kullanici
router.get("/:id", async (request, response) => {
  const users = await getUsers();
  const userId = parseInt(request.params.id);
  const user = findUser(userId, users);

  user
    ? response.json(user)
    : response.status(404).json({ message: "kullanici bulunamadi" });
});

// yeni kullanıcı oluştur

router.post("/", async (request, response) => {
  try {
    const users = await getUsers();
    const newId = generateId(users);

    const newUser = {
      id: newId,
      image: request.body.image,
      phone: request.body.phone,
      firstName: request.body.firstName,
      lastName: request.body.lastName,
      email: request.body.email,
      username: request.body.username,
      password: request.body.password,
      address: {
        address: request.body.address.address,
        city: request.body.address.city,
      },
      company: {
        address: request.body.company.address,
        city: request.body.company.city,
        name: request.body.company.name,
      },
    };

    await addUsers(newUser, users);
    response.json({ message: "kullanıcı başarıyla oluşturuldu." });
  } catch (error) {
    response.status(401).json({ message: "kullanıcı kayıt hatası" });
  }
});

// mevcut kullanıcıyı güncelle
router.put("/:id", async (request, response) => {
  try {
    const users = await getUsers();

    let isFind = false;

    const newUsers = users.map((item) => {
      if (item.id === parseInt(request.params.id)) {
        isFind = true;
        item.image = request.body.image;
        item.phone = request.body.phone;
        item.firstName = request.body.firstName;
        item.lastName = request.body.lastName;
        item.email = request.body.email;
        item.username = request.body.username;
        item.password = request.body.password;
        item.address = {
          address: request.body.address.address,
          city: request.body.address.city,
        };
        item.company = {
          address: request.body.company.address,
          city: request.body.company.city,
          name: request.body.company.name,
        };
      }
      return item;
    });

    if (!isFind) {
      return response.json({ message: "kullanıcı bulunamadı" });
    }

    await saveUsers(newUsers);
    response.json({ message: "kullanıcı başarıyla güncellendi." });
  } catch (error) {
    response.status(401).json({ message: "kullanıcı güncelleme hatası" });
  }
});

// bir kullanıcıyı sil
router.delete("/:id", async (request, response) => {
  try {
    const users = await getUsers();

    const deleteUser = users.filter((item) => {
      if (item.id !== parseInt(request.params.id)) {
        return item;
      }
    });
    saveUsers(deleteUser);
    response.json({ message: "Kullanıcı silindi" });
  } catch (error) {
    response.status(401).json({ message: "kullanıcı silme hatası" });
  }
});

const getUsers = () => {
  return new Promise((resolve, reject) => {
    fs.readFile(userDataPath, "utf8", (err, data) => {
      err ? reject(err) : resolve(JSON.parse(data));
    });
  });
};

const saveUsers = (newUsers) => {
  return fs.promises.writeFile(userDataPath, JSON.stringify(newUsers, null, 2));
};

const findUser = (userId, users) => {
  return users.find((user) => user.id === userId);
};

const generateId = (allUsers) => {
  if (allUsers.length === 0) {
    return 1;
  } else {
    const lastUserId = allUsers[allUsers.length - 1].id;
    return lastUserId + 1;
  }
};

const addUsers = async (newUser, users) => {
  try {
    users.push(newUser);

    saveUsers(users)
      .then(() => console.log("başarılı"))
      .catch((error) => console.log(error));
  } catch (err) {
    console.error("kullanıcı kaydı hatası:", err);
  }
};

export default router;
