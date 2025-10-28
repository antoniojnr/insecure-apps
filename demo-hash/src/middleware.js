import { verifyToken } from "./auth.js";
import { db } from "./database.js";

/**
 * Middleware para autenticação via JWT
 * Verifica se o token é válido e carrega o usuário no request
 */
export function authMiddleware(req, res, next) {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({
        success: false,
        message: "Token não fornecido ou formato inválido",
      });
    }

    const token = authHeader.substring(7); // Remove "Bearer "

    const payload = verifyToken(token);
    const user = db.getUserById(payload.userId);

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Usuário não encontrado",
      });
    }

    // Adiciona informações do usuário ao objeto request
    req.user = {
      id: user.id,
      email: user.email,
      name: user.name,
    };

    next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: "Autenticação falhou: " + error.message,
    });
  }
}

/**
 * Middleware para tratamento de erros
 */
export function errorMiddleware(err, req, res, next) {
  console.error("Erro:", err);

  const statusCode = err.statusCode || 500;
  const message = err.message || "Erro interno do servidor";

  res.status(statusCode).json({
    success: false,
    message,
    ...(process.env.NODE_ENV === "development" && { stack: err.stack }),
  });
}
