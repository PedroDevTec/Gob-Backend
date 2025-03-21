import prisma from "../config/db";
import { IUser } from "../types/userTypes";

export default class UserModel {
  static async createUser(nome: string, email: string, senhaHash: string): Promise<IUser> {
    console.log("Usuário cadastrado:", nome, email, senhaHash);

    return await prisma.user.create({
      data: { nome, email, senha: senhaHash },
      
    });
  }

  static async findByEmail(email: string): Promise<IUser | null> {
    return await prisma.user.findUnique({ where: { email } });
  }

  static async getAllUsers(): Promise<IUser[]> {
    return await prisma.user.findMany({
      select: { id: true, nome: true, email: true, senha: true },
    });
  }
}
