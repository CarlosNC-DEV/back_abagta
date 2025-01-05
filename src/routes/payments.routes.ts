import cron from "node-cron";
import {
  checkPaymentsAndSendMessages,
  processNextClient,
} from "../controllers/payments.controller";

// Ejecutar cada 10 minutos
cron.schedule("*/20 * * * * *", () => {
  checkPaymentsAndSendMessages();
});

// Ejecutar cada minuto
cron.schedule("*/20 * * * * *", () => {
  processNextClient();
});
