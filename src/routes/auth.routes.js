import { Router } from "express";
import {
  register,
  signin,
  updateLevel,
  verifyTokenReques,
  logOut,
} from "../controllers/auth.controller.js";
import { verifyToken } from "../middlewares/validateToken.js";
import { validateSchema } from "../middlewares/validator.middleware.js";
import { registerSchema, signinSchema } from "../schemas/auth.schema.js";

const router = Router();

router.post("/register", validateSchema(registerSchema), register);
router.post("/signin", validateSchema(signinSchema), signin);
router.post("/logout", logOut);
router.get("/verifyToken", verifyTokenReques);
router.put(
  "/level/:id",
  validateSchema(signinSchema),
  verifyToken, //**para toda pagina con info */
  updateLevel
);
export default router;
