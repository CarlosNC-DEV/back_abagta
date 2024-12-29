import app from "./src/app";
import { ENV } from "./src/config";

app.use((req, res, next) => {
  res.status(200).json("¡Bienvenido al servidor!");
  next();
});

app.listen(ENV.PORT, () => {
  console.log(
    `⚡️[servidor]: Servidor corriendo en http://localhost:${ENV.PORT}`
  );
});
