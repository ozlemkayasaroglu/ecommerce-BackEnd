import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET;

  const token = req.cookies?.JWTToken;

  if (!token) {
    return res.status(401).send({
      auth: false,
      message: "No token provided.",
    });
  }

  if (!JWT_SECRET) {
    return res
      .status(500)
      .send({ auth: false, message: "JWT_SECRET is not defined." });
  }

  jwt.verify(token, JWT_SECRET, (err) => {
    if (err) {
      return res
        .status(500)
        .send({ auth: false, message: "Failed to authenticate token." });
    }
    return next();
  });

