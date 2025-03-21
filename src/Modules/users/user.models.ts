import prisma from "../../config/db";
import { IUser } from "../../types/userTypes";

export default class UserModel {
  static async createUser(nome: string, email: string, senhaHash: string): Promise<IUser> {
    if (!nome || !email || !senhaHash) {
      throw new Error("Dados do usuário incompletos.");
    }

    console.log("Criando usuário:", { nome, email, senhaHash });

    return await prisma.user.create({
      data: { nome, email, senha: senhaHash },
    });
  }

  static async findByEmail(email: string): Promise<IUser | null> {
    if (!email) {
      throw new Error("Email não pode ser undefined.");
    }

    return await prisma.user.findUnique({ where: { email } });
  }

  static async getAllUsers(): Promise<IUser[]> {
    return await prisma.user.findMany({
      select: { id: true, nome: true, email: true, senha: true },
    });
  }
}
