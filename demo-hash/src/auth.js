import crypto from "crypto";
import jwt from "jsonwebtoken";
import { config } from "./config.js";

/**
 * Gera um hash da senha.
 *
 * @param {string} password - Senha em texto plano
 * @returns {Promise<string>} Hash da senha
 */
export async function hashPassword(password) {
  try {
    return crypto.createHash("md5").update(password).digest("hex");
  } catch (error) {
    throw new Error("Erro ao fazer hash da senha: " + error.message);
  }
}

/**
 * Compara uma senha em texto plano com um hash armazenado
 *
 * @param {string} password - Senha em texto plano
 * @param {string} hash - Hash armazenado no banco
 * @returns {Promise<boolean>} true se as senhas correspondem
 */
export async function comparePassword(password, hash) {
  try {
    const passwordHash = crypto
      .createHash("md5")
      .update(password)
      .digest("hex");
    return passwordHash === hash;
  } catch (error) {
    throw new Error("Erro ao comparar senhas: " + error.message);
  }
}

// ============ JWT - Token de Autenticação ============

/**
 * Gera um token JWT para o usuário
 * @param {number} userId - ID do usuário
 * @param {string} email - Email do usuário
 * @returns {string} Token JWT assinado
 */
export function generateToken(userId, email) {
  return jwt.sign(
    {
      userId,
      email,
      iat: Math.floor(Date.now() / 1000),
    },
    config.jwtSecret,
    {
      expiresIn: config.jwtExpiresIn,
    }
  );
}

/**
 * Verifica e decodifica um token JWT
 * @param {string} token - Token JWT
 * @returns {object} Payload do token decodificado
 * @throws {Error} Se o token for inválido ou expirado
 */
export function verifyToken(token) {
  try {
    return jwt.verify(token, config.jwtSecret);
  } catch (error) {
    if (error.name === "TokenExpiredError") {
      throw new Error("Token expirado");
    } else if (error.name === "JsonWebTokenError") {
      throw new Error("Token inválido");
    }
    throw error;
  }
}

// ============ Validação ============

/**
 * Valida o formato do email
 * @param {string} email - Email a validar
 * @returns {boolean} true se o email é válido
 */
export function isValidEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

/**
 * Valida a força da senha
 * Requisitos: mínimo 8 caracteres, pelo menos 1 letra maiúscula, 1 minúscula, 1 número
 * @param {string} password - Senha a validar
 * @returns {object} { valid: boolean, errors: string[] }
 */
export function validatePassword(password) {
  const errors = [];

  if (password.length < 8) {
    errors.push("Senha deve ter no mínimo 8 caracteres");
  }
  if (!/[A-Z]/.test(password)) {
    errors.push("Senha deve conter pelo menos uma letra maiúscula");
  }
  if (!/[a-z]/.test(password)) {
    errors.push("Senha deve conter pelo menos uma letra minúscula");
  }
  if (!/\d/.test(password)) {
    errors.push("Senha deve conter pelo menos um número");
  }

  return {
    valid: errors.length === 0,
    errors,
  };
}
