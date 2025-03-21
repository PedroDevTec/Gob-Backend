import { Request, Response } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import UserModel from "../models/userModel";
import { IUserLogin, ITokenPayload, IUser } from "../types/userTypes";
import { JWT_SECRET } from "../config/env";

export const register = async (req: Request, res: Response): Promise<void> => {
  console.log(req.body, "Body recebido no Postman");

  const { nome, email, senha }: IUserLogin = req.body;

  try {
    // Verifica se o email já está cadastrado
    const userExists = await UserModel.findByEmail(email);
    if (userExists) {
      res.status(400).json({ success: false, message: "E-mail já cadastrado!" });
      return;
    }

    // Hash da senha
    const salt = await bcrypt.genSalt(10);
    const senhaHash = await bcrypt.hash(senha, salt);

    // Criar usuário no banco de dados e garantir que o ID seja retornado
    const user: IUser = await UserModel.createUser(nome, email, senhaHash);

    if (!user.id) {
      res.status(500).json({ success: false, message: "Erro ao obter ID do usuário." });
      return;
    }

    // Criar token JWT com ID correto
    const token = jwt.sign({ id: user.id } as ITokenPayload, JWT_SECRET, { expiresIn: "1h" });

    console.log("Usuário cadastrado:", user);

    res.status(201).json({ success: true, message: "Usuário cadastrado!", token, user });
  } catch (error) {
    console.error("Erro ao cadastrar usuário:", error);
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
