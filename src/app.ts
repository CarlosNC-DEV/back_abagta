import express, { Express } from 'express';
import cors from 'cors';
import morgan from 'morgan';

// Rutas
import userRoutes from "./routes/user.routes";
import categoriesRoutes from "./routes/categories.routes";
import messagesRoutes from "./routes/messages.routes";
import clientsRoutes from "./routes/clients.routes";

const app: Express = express();

app.use(cors());
app.use(morgan("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/api", userRoutes);
app.use("/api", categoriesRoutes);
app.use("/api", messagesRoutes);
app.use("/api", clientsRoutes);

export default app;