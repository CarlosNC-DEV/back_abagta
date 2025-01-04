import { Router } from "express";
import {
  getAllMessages,
  createMessage,
  updateMessage,
} from "../controllers/messages.controller";
import { validateSchema } from "../middlewares/zod.middleware";
import { verifyToken } from "../middlewares/token.middleware";
import {
  createMessageSchema,
  updateMessageSchema,
} from "../schemas/messages.schema";
const router = Router();

router.use(verifyToken);

// Ruta para obtener todas los mensajes
router.get("/messages", getAllMessages);
// Ruta para crear un mensaje
router.post(
  "/messages/register",
  validateSchema(createMessageSchema),
  createMessage
);

// Ruta para actualizar un mensaje
router.put("/messages/:id", validateSchema(updateMessageSchema), updateMessage);

export default router;
