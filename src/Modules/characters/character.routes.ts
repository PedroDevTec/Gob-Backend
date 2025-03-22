import { Router } from "express";
import { getCharacters, createCharacter, updateCharacter, deleteCharacter } from "./character.controller";
import auth from "../../middleware/auth";

const router = Router();

// Criar personagem
router.post("/create", auth, createCharacter);

// Atualizar personagem (ex: progresso, XP, etc.)
router.put("/:id", auth, updateCharacter);

// Deletar personagem
router.delete("/:id", auth, deleteCharacter);

// (Opcional) Listar personagens do usuário
 router.get("/", auth, getCharacters);

export default router;
