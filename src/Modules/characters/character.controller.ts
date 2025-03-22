// import { Request, Response } from "express";
// import { CharacterService } from "./character.service";

// export const createCharacter = async (req: Request, res: Response): Promise<void> => {
//   try {
//     const userId = req.user?.id; // 🔥 Recupera o `userId` do token JWT
//     const { nome, classId } = req.body; // 🔥 Recebe o nome do personagem

//     if (!userId) {
//       res.status(401).json({ success: false, message: "Usuário não autenticado." });
//       return;
//     }

//     if (!nome) {
//       res.status(400).json({ success: false, message: "O nome do personagem é obrigatório." });
//       return;
//     }

//     // Criar o personagem
//     const newCharacter = await CharacterService.createCharacter(userId, nome, classId || 1); // 🔥 Define classe padrão

//     res.status(201).json({ success: true, character: newCharacter });
//   } catch (error) {
//     console.error("❌ Erro ao criar personagem:", error);
//     res.status(500).json({ success: false, message: "Erro ao criar personagem." });
//   }
// };
