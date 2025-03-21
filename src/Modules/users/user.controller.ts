import { Request, Response } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import UserModel from "./user.models";
import { IUserLogin, ITokenPayload, IUser } from "../../types/userTypes";
import { JWT_SECRET } from "../../config/env";

export const register = async (req: Request, res: Response): Promise<void> => {
  console.log("🚀 Body recebido:", req.body); // 🔹 Verifica se o body chega corretamente

  const { nome, email, senha } = req.body;
  console.log("Nome:", nome, "Email:", email, "Senha:", senha); // 🔹 Verifica os valores recebidos

  if (!nome || !email || !senha) {
    res.status(400).json({ success: false, message: "Todos os campos são obrigatórios!" });
    return;
  }

  try {
    const userExists = await UserModel.findByEmail(email);
    if (userExists) {
      res.status(400).json({ success: false, message: "E-mail já cadastrado!" });
      return;
    }

    const salt = await bcrypt.genSalt(10);
    const senhaHash = await bcrypt.hash(senha, salt);

    const user: IUser = await UserModel.createUser(nome, email, senhaHash);
    const token = jwt.sign({ id: user.id }, JWT_SECRET, { expiresIn: "1h" });

    console.log("✅ Usuário cadastrado com sucesso:", user);

    res.status(201).json({ success: true, message: "Usuário cadastrado!", token, user });
  } catch (error) {
    console.error("❌ Erro ao cadastrar usuário:", error);
    res.status(500).json({ success: false, message: "Erro ao cadastrar usuário." });
  }
};


export const login = async (req: Request, res: Response): Promise<void> => {
  const { email, senha }: IUserLogin = req.body;

  try {
    // Buscar usuário no banco e garantir que o ID seja retornado
    const user = await UserModel.findByEmail(email);
    if (!user || !user.id) {
      res.status(404).json({ success: false, message: "Usuário não encontrado!" });
      return;
    }

    // Verifica se a senha está correta
    const senhaCorreta = await bcrypt.compare(senha, user.senha);
    if (!senhaCorreta) {
      res.status(401).json({ success: false, message: "Senha incorreta!" });
      return;
    }

    // Criar token JWT garantindo que o ID está correto
    const token = jwt.sign({ id: user.id } as ITokenPayload, JWT_SECRET, { expiresIn: "1h" });

    console.log("Usuário autenticado:", { id: user.id, email: user.email });

    res.status(200).json({ success: true, token, user: { id: user.id, nome: user.nome, email: user.email } });
  } catch (error) {
    console.error("Erro ao fazer login:", error);
    res.status(500).json({ success: false, message: "Erro ao fazer login." });
  }
};
