import jwt from "jsonwebtoken";

import { config } from "dotenv";

config();
const passwordx = process.env.CREDENT;

export const verifyToken = async (req, res, next) => {
  const { token } = req.cookies;
  console.log(token);
  if (!token) {
    return res.status(401).send(["**Unauthorized+"]);
  }
  jwt.verify(token, passwordx, (err, user) => {
    if (err) {
      return res.status(403).send(["**Unauthorized-"]);
    }
    req.user = user; //solo ID
    next();
    console.log("********************/");
  });
};
