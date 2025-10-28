import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

// Carregar variáveis de ambiente
dotenv.config();

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export const config = {
  port: process.env.PORT || 3000,
  nodeEnv: process.env.NODE_ENV || "development",

  // JWT
  jwtSecret: process.env.JWT_SECRET || "dev-secret-key",
  jwtExpiresIn: process.env.JWT_EXPIRES_IN || "24h",

  // Database
  dbType: process.env.DB_TYPE || "sqlite",
  dbPath: process.env.DB_PATH || path.join(__dirname, "../data/users.db"),

  // CORS
  corsOrigin: process.env.CORS_ORIGIN || "*",
};
