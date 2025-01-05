import dotenv from "dotenv";
dotenv.config();

export const ENV = {
  PORT: process.env.PORT,
  JWT_SECRET: process.env.JWT_SECRET || "mysecretkey",
  NUMBER_ADMIN: process.env.NUMBER_ADMIN,
};
