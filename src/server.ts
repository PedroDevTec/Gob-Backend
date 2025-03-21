import express from "express";
import cors from "cors";
import userRoutes from "./Modules/users/user.routers"; // ✅ Caminho correto
import characterRoutes from "./Modules/characters/character.routes";
const app = express();

app.use(cors());
app.use(express.urlencoded({ extended: false })); // 🔹 Habilita CORS para evitar problemas em requisições externas
app.use(express.json()); // 🔹 Permite que o Express entenda JSON no corpo das requisições

app.use("/api/users", userRoutes); // 🔹 Rotas de usuários
app.use("/api/characters", characterRoutes); // 🔹 Rotas de personagens
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Servidor rodando em http://localhost:${PORT}`));
