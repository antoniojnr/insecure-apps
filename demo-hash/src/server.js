import express from "express";
import cors from "cors";
import { config } from "./config.js";
import { db } from "./database.js";
import { errorMiddleware } from "./middleware.js";
import authRoutes from "./routes/auth.js";
import usersRoutes from "./routes/users.js";

const app = express();

// Habilita CORS
app.use(
  cors({
    origin: config.corsOrigin,
    credentials: true,
  })
);

// Habilita a serialização dos dados em JSON
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Middleware para logging
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.path}`);
  next();
});

// ============ Rotas ============

// Health check
app.get("/health", (req, res) => {
  res.json({
    status: "OK",
    timestamp: new Date().toISOString(),
    environment: config.nodeEnv,
  });
});

// Rotas de autenticação
app.use("/api/auth", authRoutes);

// Rotas de usuários
app.use("/api/users", usersRoutes);

// Rota não encontrada
app.use("*", (req, res) => {
  res.status(404).json({
    success: false,
    message: "Rota não encontrada",
  });
});

app.use(errorMiddleware);

const startServer = () => {
  try {
    db.initialize();
    console.log("✓ Banco de dados inicializado");

    app.listen(config.port, () => {
      console.log(`
╔════════════════════════════════════════╗
║   API REST - Autenticação de Usuários  ║
║                                        ║
║   Servidor rodando em:                 ║
║   http://localhost:${config.port}                ║
║                                        ║
║   Ambiente: ${config.nodeEnv.padEnd(25)}  ║
╚════════════════════════════════════════╝
      `);
    });
  } catch (error) {
    console.error("Erro ao iniciar servidor:", error);
    process.exit(1);
  }
};

process.on("SIGINT", () => {
  console.log("\nEncerrando servidor...");
  db.close();
  process.exit(0);
});

startServer();

export default app;
