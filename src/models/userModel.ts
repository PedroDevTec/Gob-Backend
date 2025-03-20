import pool from "../config/db";
import { IUser } from "../types/userTypes";

export default class UserModel {
  static async createUser(nome: string, email: string, senhaHash: string): Promise<IUser> {
    const result = await pool.query(
      "INSERT INTO users (nome, email, senha) VALUES ($1, $2, $3) RETURNING *",
      [nome, email, senhaHash]
    );
    return result.rows[0];
  }

  static async findByEmail(email: string): Promise<IUser | null> {
    const result = await pool.query("SELECT * FROM users WHERE email = $1", [email]);
    return result.rows[0] || null;
  }

  static async getAllUsers(): Promise<IUser[]> {
    const result = await pool.query("SELECT id, nome, email FROM users");
    return result.rows;
  }
}
