require("dotenv").config();
const express = require("express");
const cors = require("cors");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { Pool } = require("pg");

const app = express();
app.use(cors());
app.use(express.json());

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }, // Necessário para conexão segura com Supabase
});

// 🔹 Rota de Cadastro de Usuário
app.post("/register", async (req, res) => {
  const { nome, email, senha } = req.body;
  try {
    const salt = bcrypt.genSaltSync(10);
    const senhaHash = bcrypt.hashSync(senha, salt);

    const result = await pool.query(
      "INSERT INTO users (nome, email, senha) VALUES ($1, $2, $3) RETURNING *",
      [nome, email, senhaHash]
    );

    res.json({
      success: true,
      message: "Usuário cadastrado!",
      user: result.rows[0],
    });
  } catch (err) {
    console.error(err);
    res
      .status(500)
      .json({ success: false, message: "Erro ao cadastrar usuário." });
  }
});

// 🔹 Rota de Login
app.post("/login", async (req, res) => {
  const { email, senha } = req.body;
  try {
    const user = await pool.query("SELECT * FROM users WHERE email = $1", [
      email,
    ]);
    if (user.rows.length === 0)
      return res.status(400).json({ message: "Usuário não encontrado!" });

    const senhaCorreta = bcrypt.compareSync(senha, user.rows[0].senha);
    if (!senhaCorreta)
      return res.status(401).json({ message: "Senha incorreta!" });

    const token = jwt.sign({ id: user.rows[0].id }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });

    res.json({ success: true, token, user: user.rows[0] });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Erro ao fazer login." });
  }
});

// 🔹 Rota para Registrar Logs de Atividades
app.post("/logs", async (req, res) => {
  const { userId, acao } = req.body;
  try {
    await pool.query(
      "INSERT INTO logs (user_id, acao, data) VALUES ($1, $2, NOW())",
      [userId, acao]
    );
    res.json({ success: true, message: "Log registrado!" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Erro ao registrar log." });
  }
});

// 🔹 Rota para Atualizar Usuário
app.put("/update/:id", async (req, res) => {
  const { id } = req.params;
  const { nome, email } = req.body;
  try {
    await pool.query("UPDATE users SET nome = $1, email = $2 WHERE id = $3", [
      nome,
      email,
      id,
    ]);
    res.json({ success: true, message: "Usuário atualizado!" });
  } catch (err) {
    console.error(err);
    res
      .status(500)
      .json({ success: false, message: "Erro ao atualizar usuário." });
  }
});

// 🔹 Rota para Deletar Usuário
app.delete("/delete/:id", async (req, res) => {
  const { id } = req.params;
  try {
    await pool.query("DELETE FROM users WHERE id = $1", [id]);
    res.json({ success: true, message: "Usuário deletado!" });
  } catch (err) {
    console.error(err);
    res
      .status(500)
      .json({ success: false, message: "Erro ao deletar usuário." });
  }
});

// 🔹 Rota para Listar Todos os Usuários
app.get("/users", async (req, res) => {
  try {
    const result = await pool.query("SELECT id, nome, email FROM users");
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res
      .status(500)
      .json({ success: false, message: "Erro ao buscar usuários." });
  }
});

// 🔹 Rota para Buscar Usuário por ID
app.get("/users/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const result = await pool.query(
      "SELECT id, nome, email FROM users WHERE id = $1",
      [id]
    );
    if (result.rows.length === 0)
      return res.status(404).json({ message: "Usuário não encontrado." });
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res
      .status(500)
      .json({ success: false, message: "Erro ao buscar usuário." });
  }
});

// Inicia o servidor
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Servidor rodando na porta ${PORT}`));
