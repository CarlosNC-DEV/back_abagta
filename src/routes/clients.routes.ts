import { Router } from "express";
import {
  getAllClients,
  getClientsByCategory,
  createClient,
  updateClient,
  processPayment,
} from "../controllers/clients.controller";
import { validateSchema } from "../middlewares/zod.middleware";
import { verifyToken } from "../middlewares/token.middleware";
import {
  createClientSchema,
  getClientsByCategorySchema,
  updateClientSchema,
  payClientSchema,
} from "../schemas/clients.schema";
const router = Router();

router.use(verifyToken);

// Ruta para obtener todas los clientes
router.get("/clients", getAllClients);

//Ruta para obtener los usuarios por categoria
router.get(
  "/clients/category/:id_category",
  validateSchema(getClientsByCategorySchema),
  getClientsByCategory
);

// Ruta para crear un cliente
router.post(
  "/clients/register",
  validateSchema(createClientSchema),
  createClient
);

// Ruta para actualizar un cliente
router.put("/clients/:id", validateSchema(updateClientSchema), updateClient);

// Ruta para marcar un pago como completado
router.post("/clients/:id/pay", validateSchema(payClientSchema), processPayment);

export default router;
