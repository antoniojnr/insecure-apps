import express from "express";
import { authMiddleware } from "../middleware.js";
import { db } from "../database.js";

const router = express.Router();

/**
 * GET /api/users/profile
 * Retorna o perfil do usuário autenticado
 */
router.get("/profile", authMiddleware, (req, res) => {
  try {
    const user = db.getUserProfile(req.user.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "Usuário não encontrado",
      });
    }

    return res.status(200).json({
      success: true,
      data: user,
    });
  } catch (error) {
    console.error("Erro ao buscar perfil:", error);
    return res.status(500).json({
      success: false,
      message: "Erro ao buscar perfil: " + error.message,
    });
  }
});

export default router;
