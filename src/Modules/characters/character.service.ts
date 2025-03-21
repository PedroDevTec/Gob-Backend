import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export class CharacterService {
  static async createCharacter(userId: string, name: string, classId: number) {
    console.log("🚀 Body recebido:", { userId, name, classId });
    return prisma.character.create({
      data: {
        userId,
        name,
        classId: classId.toString(),
        level: 1,
      }
    });
  }
  static async deleteCharacter(userId: string, characterId: string) {
    // Verificar se o personagem pertence ao usuário
    const character = await prisma.character.findUnique({
      where: { id: characterId },
    });

    if (!character) {
      throw new Error("Personagem não encontrado.");
    }

    if (character.userId !== userId) {
      throw new Error("Você não tem permissão para excluir este personagem.");
    }

    // Excluir o personagem
    await prisma.character.delete({
      where: { id: characterId },
    });

    return { message: "Personagem excluído com sucesso." };
  }
}
