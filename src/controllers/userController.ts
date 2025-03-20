import { Request, Response } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import UserModel from "../models/userModel";
import { IUserLogin, ITokenPayload } from "../types/userTypes";
import { JWT_SECRET } from "../config/env";

export const register = async (req: Request, res: Response) => {
  const { nome, email, senha }: IUserLogin = req.body;

  try {
    const salt = await bcrypt.genSalt(10);
    const senhaHash = await bcrypt.hash(senha, salt);
    const user = await UserModel.createUser(nome, email, senhaHash);

    res.status(201).json({ success: true, message: "Usuário cadastrado!", user }); // ✅ Sem `return`
  } catch (error) {
    res.status(500).json({ success: false, message: "Erro ao cadastrar usuário." });
  }
};

export const login = async (req: Request, res: Response) => {
  const { email, senha }: IUserLogin = req.body;

  try {
    const user = await UserModel.findByEmail(email);
    if (!user) {
      res.status(404).json({ message: "Usuário não encontrado!" });
      return; // ✅ Evita continuar a execução
    }

    const senhaCorreta = await bcrypt.compare(senha, user.senha);
    if (!senhaCorreta) {
      res.status(401).json({ message: "Senha incorreta!" });
      return; // ✅ Evita continuar a execução
    }

    const token = jwt.sign({ id: user.id } as ITokenPayload, JWT_SECRET, { expiresIn: "1h" });

    res.status(200).json({ success: true, token, user }); // ✅ Sem `return`
  } catch (error) {
    res.status(500).json({ success: false, message: "Erro ao fazer login." });
  }
};
