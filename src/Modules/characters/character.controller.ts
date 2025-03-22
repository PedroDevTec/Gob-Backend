import { Request, Response } from "express";
import { CharacterService } from "./character.service";

export const createCharacter = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = req.user?.id; // 🔥 Recupera o `userId` do token JWT
    const { nome, classId } = req.body; // 🔥 Recebe o nome do personagem

    if (!userId) {
      res.status(401).json({ success: false, message: "Usuário não autenticado." });
      return;
    }

    if (!nome) {
      res.status(400).json({ success: false, message: "O nome do personagem é obrigatório." });
      return;
    }

    // Criar o personagem
    const newCharacter = await CharacterService.createCharacter(userId, nome, classId || 1); // 🔥 Define classe padrão

    res.status(201).json({ success: true, character: newCharacter });
  } catch (error) {
    console.error("❌ Erro ao criar personagem:", error);
    res.status(500).json({ success: false, message: "Erro ao criar personagem." });
  }
  
};
export const updateCharacter = async (req: Request, res: Response): Promise<void> => {
    try {
      const userId = req.user?.id;
      const characterId = req.params.id;
      const updates = req.body;
      console.log("🚀 Atualizações recebidas:", updates);
  
      if (!userId) {
        res.status(401).json({ success: false, message: "Usuário não autenticado." });
        return;
      }
  
      const updated = await CharacterService.updateCharacter(userId, characterId, updates);
      res.status(200).json({ success: true, character: updated });
    } catch (error) {
      console.error("❌ Erro ao atualizar personagem:", error);
      res.status(500).json({ success: false, message: "Erro ao atualizar personagem." });
    }
  };
    export const deleteCharacter = async (req: Request, res: Response): Promise<void> => {
        try {
        const userId = req.user?.id;
        const characterId = req.params.id;
        console.log("🚀 ID do personagem:", characterId);
        if (!userId) {
            res.status(401).json({ success: false, message: "Usuário não autenticado." });
            return;
        }
    
        const deleted = await CharacterService.deleteCharacter(userId, characterId);
        res.status(200).json({ success: true, message: deleted.message });
        } catch (error) {
        console.error("❌ Erro ao excluir personagem:", error);
        res.status(500).json({ success: false, message: "Erro ao excluir personagem." });
        }
    };  
    export const getCharacters = async (req: Request, res: Response): Promise<void> => {
        try {
          const userId = req.user?.id;
      
          if (!userId) {
            res.status(401).json({ success: false, message: "Usuário não autenticado." });
            return;
          }
      
          const characters = await CharacterService.getCharactersByUser(userId);
          res.status(200).json({ success: true, characters });
        } catch (error) {
          console.error("❌ Erro ao buscar personagens:", error);
          res.status(500).json({ success: false, message: "Erro ao buscar personagens." });
        }
      };