import { Router } from "express";
import {
  getAllUsers,
  createUser,
  loginUser,
  getUserById,
} from "../controllers/user.controller";
import { validateSchema } from "../middlewares/zod.middleware";
import { createUserSchema, loginUserSchema, getUserByIdSchema } from "../schemas/user.schema";
import { verifyToken } from "../middlewares/token.middleware";

const router = Router();

// Ruta para obtener todos los usuarios
router.get("/users", getAllUsers);
// Ruta para crear un nuevo usuario
router.post("/users/register", validateSchema(createUserSchema), createUser);
// Ruta para iniciar sesión
router.post("/users/login", validateSchema(loginUserSchema), loginUser);
// Ruta para obtener un usuario por su ID
router.get("/users/:id", verifyToken, validateSchema(getUserByIdSchema),  getUserById);

export default router;
