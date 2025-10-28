import express from "express";
import {
  hashPassword,
  comparePassword,
  generateToken,
  isValidEmail,
  validatePassword,
} from "../auth.js";
import { db } from "../database.js";

const router = express.Router();

/**
 * POST /api/auth/register
 * Registra um novo usuário
 */
router.post("/register", async (req, res) => {
  try {
    const { email, name, password } = req.body;

    // Validações
    if (!email || !name || !password) {
      return res.status(400).json({
        success: false,
        message: "Email, nome e senha são obrigatórios",
      });
    }

    if (!isValidEmail(email)) {
      return res.status(400).json({
        success: false,
        message: "Email inválido",
      });
    }

    // Validar força da senha
    const passwordValidation = validatePassword(password);
    if (!passwordValidation.valid) {
      return res.status(400).json({
        success: false,
        message: "Senha fraca",
        errors: passwordValidation.errors,
      });
    }

    // Verificar se o email já existe
    const existingUser = db.getUserByEmail(email);
    if (existingUser) {
      return res.status(409).json({
        success: false,
        message: "Email já cadastrado no sistema",
      });
    }

    // Hash da senha
    const passwordHash = await hashPassword(password);

    // Criar usuário
    const user = db.createUser(email, name, passwordHash);

    // Gerar token
    const token = generateToken(user.id, user.email);

    return res.status(201).json({
      success: true,
      message: "Usuário registrado com sucesso",
      data: {
        id: user.id,
        email: user.email,
        name: user.name,
        token,
      },
    });
  } catch (error) {
    console.error("Erro no registro:", error);
    return res.status(500).json({
      success: false,
      message: "Erro ao registrar usuário: " + error.message,
    });
  }
});

/**
 * POST /api/auth/login
 * Autentica um usuário e retorna um token JWT
 */
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validações
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Email e senha são obrigatórios",
      });
    }

    // Buscar usuário
    const user = db.getUserByEmail(email);
    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Email ou senha incorretos",
      });
    }

    // Comparar senha
    const isPasswordValid = await comparePassword(password, user.password_hash);
    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        message: "Email ou senha incorretos",
      });
    }

    // Atualizar último login
    db.updateLastLogin(user.id);

    // Gerar token
    const token = generateToken(user.id, user.email);

    return res.status(200).json({
      success: true,
      message: "Login realizado com sucesso",
      data: {
        id: user.id,
        email: user.email,
        name: user.name,
        token,
      },
    });
  } catch (error) {
    console.error("Erro no login:", error);
    return res.status(500).json({
      success: false,
      message: "Erro ao fazer login: " + error.message,
    });
  }
});

export default router;
