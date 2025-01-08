import User from "../models/user.model.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { config } from "dotenv";

config();
const passwordx = process.env.CREDENT;

//
export const register = async (req, res) => {
  const { email, password, username } = req.body;

  try {
    const foundUser = await User.findOne({ email: email });
    if (foundUser) {
      return res.status(400).json(["**the email already exists11"]);
    }

    const passwordHash = await bcrypt.hash(password, 10);
    const newUser = new User({
      username,
      email,
      password: passwordHash,
      level: 1,
    });

    const savedUser = await newUser.save();
    console.log(savedUser);
    //
    if (!passwordx) {
      return res
        .status(500)
        .json({ message: "**Error: JWT_SECRET no definido." });
    }
    jwt.sign(
      { id: savedUser._id },
      passwordx,
      { expiresIn: "1d" },
      (err, token) => {
        if (err) {
          console.log(err);
          return res.status(500).send(["**Error creating token"]);
        }

        res.cookie("token", token, {
          secure: true, //  Solo HTTPS en producción
          sameSite: "None", // ✅ None para producción, Lax para local
          expires: new Date(Date.now() + 24 * 60 * 60 * 1000), // ✅ Expira en 24 horas
        });

        /*res.cookie("token", token, {
            httpOnly: true, // ✅ Protege la cookie contra JS=aplication ya no aparece la cookie
          secure: process.env.NODE_ENV === "production", //producción (HTTPS)=production   * local=development
          sameSite: "None", // ✅ Permitir cookies entre diferentes dominios, Lax es lo contrario
        });*/

        res.status(200).json({
          id: savedUser._id,
          username: savedUser.username,
          email: savedUser.email,
          password: savedUser.password,
          level: savedUser.level,
        });
      }
    );
  } catch (err) {
    res.status(500).send(["**error creating user-"]);
    console.log(err);
  }
};

export const signin = async (req, res) => {
  const { email, password } = req.body;
  try {
    const foundUser = await User.findOne({ email: email });
    if (!foundUser) {
      return res.status(400).send(["**user no found"]);
    }
    const isMatch = await bcrypt.compare(password, foundUser.password); //*****x
    if (!isMatch) {
      return res.status(400).send(["incorrect pasword"]);
    }
    jwt.sign(
      { id: foundUser._id },
      passwordx,
      { expiresIn: "1d" },
      (err, token) => {
        if (err) {
          console.log(err);
          return res.status(500).send(["**error creating token"]);
        }

        res.cookie("token", token, {
          // httpOnly: false, //process.env.NODE_ENV === "production", // ✅ Solo true en producción para seguridad
          secure: true, // ✅ Solo HTTPS en producción
          sameSite: "none", // ✅ None para producción, Lax para local
          //  expires: new Date(Date.now() + 24 * 60 * 60 * 1000), // ✅ Expira en 24 horas
        });

        /* res.cookie("token", token, {
         
          httpOnly: true,
          secure: process.env.NODE_ENV === "production", //producción (HTTPS)=production   * local=development
          sameSite: "None", // ✅ Permitir cookies entre diferentes dominios, Lax es lo contrario
        });*/
        res.status(200).json({
          id: foundUser.id,
          username: foundUser.username,
          email: foundUser.email,
          password: foundUser.password,
          level: foundUser.level,
          //createdAt: foundUser.createdAt,
          //updatedAt: foundUser.updatedAt,
        });
      }
    );
  } catch (err) {
    console.log(err);
    res.status(500).send(["**Error user login"]);
  }
};

export const verifyTokenReques = (req, res) => {
  const { token } = req.cookies;
  console.log(passwordx);
  console.log(token);
  console.log(req);
  console.log(
    "******************************************************************************/*/*/"
  ); /*
  console.log("passwordx");*/
  if (!token) {
    return res.status(401).send(["**token unexist"]);
  }
  jwt.verify(token, passwordx, async (err, user) => {
    if (err) {
      return res.status(403).send(["**6unauthorized-"]);
    }
    const userFound = await User.findById(user.id);
    if (!userFound) {
      return res.status(401).send(["**6unauthorized+"]);
    }
    return res.json({
      id: userFound.id,
      username: userFound.username,
      email: userFound.email,
      level: userFound.level,
      f: token,
    });
  });
};

export const updateLevel = async (req, res) => {
  if (req.body.level) {
    console.log(req.body);
    const level = await User.findByIdAndUpdate(req.user.id, req.body, {
      new: true,
    });
    if (!level) {
      return res.status(404).send(["**level no found"]);
    }
    res.json(level);
  }

  if (req.body.password) {
    const passwordHash = await bcrypt.hash(req.body.password, 10);

    const foundPassword = await User.findByIdAndUpdate(
      req.user.id,
      { password: passwordHash },
      {
        new: true,
      }
    );
    if (!foundPassword) {
      return res.status(404).send(["**password no found"]);
    }
    res.json(foundPassword);
  }

  if (req.body.email) {
    const foundUser = await User.findOne({ email: req.body.email });

    if (foundUser) {
      return res.status(400).json(["**the email already exists"]);
    }

    const email = await User.findByIdAndUpdate(req.user.id, req.body, {
      new: true,
    });
    res.json(email);
  }
  console.log(req);
  console.log("***************");
  console.log(req.user);
};

export const logOut = async (req, res) => {
  res.cookie("token", "", {
    httpOnly: false, //process.env.NODE_ENV === "production", //  Coincide con la creación
    secure: process.env.NODE_ENV === "production", //  Coincide con la creación
    sameSite: process.env.NODE_ENV === "production" ? "None" : "Lax", //  Coincide con la creación
    expires: new Date(0), // ✅ Expira inmediatamente
  });
  return res.sendStatus(200);
};
