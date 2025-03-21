import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { JWT_SECRET } from "../config/env";
import { ITokenPayload } from "../types/userTypes";

// Extendendo o Request para incluir o usuário autenticado
declare global {
  namespace Express {
    interface Request {
      user?: ITokenPayload;
    }
  }
}

export default function auth(req: Request, res: Response, next: NextFunction): void {
  try {
    // Verifica se o token foi enviado no cabeçalho Authorization
    const authHeader = req.header("Authorization");

    if (!authHeader) {
      res.status(401).json({ success: false, message: "Acesso negado. Nenhum token fornecido." });
      return; // 🚀 IMPORTANTE: Garantir que a execução pare aqui
    }

    // O token pode vir no formato "Bearer token_aqui", então removemos "Bearer "
    const token = authHeader.startsWith("Bearer ") ? authHeader.slice(7) : authHeader;

    // Decodifica o token
    const decoded = jwt.verify(token, JWT_SECRET) as ITokenPayload;

    if (!decoded || !decoded.id) {
      res.status(401).json({ success: false, message: "Token inválido." });
      return; // 🚀 IMPORTANTE: Garantir que a execução pare aqui
    }

    // Atribui o usuário autenticado ao request
    req.user = decoded;

    // Continua para a próxima função
    next();
  } catch (error) {
    res.status(401).json({ success: false, message: "Token inválido ou expirado." });
    return; // 🚀 IMPORTANTE: Garantir que a execução pare aqui
  }
}
