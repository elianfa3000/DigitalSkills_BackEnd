import jwt from "jsonwebtoken";

export const verifyToken = async (req, res, next) => {
  const { token } = req.cookies;
  if (!token) {
    return res.status(401).send(["**Unauthorized"]);
  }
  jwt.verify(token, "secret123", (err, user) => {
    if (err) {
      return res.status(403).send(["**Unauthorized"]);
    }
    req.user = user; //solo ID
    next();
    console.log("********************/");
  });
};
