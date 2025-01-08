import { z } from "zod";

export const registerSchema = z.object({
  username: z
    .string({ required_error: "El nombre es requerido" }) //User name is required
    .min(6, { message: "El nombre debe tener más de 6 dígitos" }), //username must be at least 6 characters
  email: z
    .string({ required_error: "El email es requerido" }) //Email is required
    .email({ message: "Email inválido" }), //Invalid email
  password: z
    .string({ required_error: "La contraseña es requerida" }) //Password is required
    .min(6, { message: "La contraseña debe tener más de 6 dígitos " }), //password must be at least 6 characters
  level: z.number().int().optional(),
});

export const signinSchema = z.object({
  email: z
    .string({ required_error: "El email es requerido" })
    .email({ message: "Email inválido" })
    .optional(),
  password: z
    .string({ required_error: "La contraseña es requerida" })
    .min(6, { message: "La contraseña debe tener más de 6 dígitos " })
    .optional(),
  level: z.number().int().optional(),
});
