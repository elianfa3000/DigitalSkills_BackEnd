import User from "../models/user.model.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const password = process.env.Credent;

export const register = async (req, res) => {
  const { email, password, username } = req.body;

  try {
    const foundUser = await User.findOne({ email: email });
    if (foundUser) {
      return res.status(400).json(["**the email already exists"]);
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
    jwt.sign(
      { id: savedUser._id },
      password,
      { expiresIn: "1d" },
      (err, token) => {
        if (err) {
          console.log(err);
          return res.status(500).send(["**Error creating token"]);
        }

        res.cookie("token", token);
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
    res.status(500).send(["**error creating user"]);
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
      password,
      { expiresIn: "1d" },
      (err, token) => {
        if (err) {
          console.log(err);
          return res.status(500).send(["**error creating token"]);
        }
        res.cookie("token", token);
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

  if (!token) {
    return res.status(401).send(["**token unexist"]);
  }
  jwt.verify(token, password, async (err, user) => {
    if (err) {
      return res.status(403).send(["**unauthorized"]);
    }
    const userFound = await User.findById(user.id);
    if (!userFound) {
      return res.status(401).send(["**unauthorized"]);
    }
    return res.json({
      id: userFound.id,
      username: userFound.username,
      email: userFound.email,
      level: userFound.level,
    });
  });
};

export const updateLevel = async (req, res) => {
  if (req.body.level) {
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
  res.cookie("token", "" /* { expires: new Date(0) }*/);
  return res.sendStatus(200);
};
