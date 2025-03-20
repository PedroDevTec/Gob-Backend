import { Request, Response, NextFunction } from "express";
import "../types/express"; // Ensure the extended Request type is loaded
import jwt from "jsonwebtoken";
import { JWT_SECRET } from "../config/env";
import { ITokenPayload } from "../types/userTypes";

export default function auth(req: Request, res: Response, next: NextFunction) {
  const token = req.header("Authorization");
  if (!token) return res.status(401).json({ message: "Acesso negado" });

  try {
    const decoded = jwt.verify(token, JWT_SECRET) as ITokenPayload;
    req.user = decoded;
    next();
  } catch {
    res.status(401).json({ message: "Token inválido" });
  }
}
