import express from "express";
import cors from "cors";
import userRoutes from "./routes/userRoutes";
import { PORT } from "./config/env";

const app = express();
app.use(cors());
app.use(express.json());

app.use("/api", userRoutes);

app.listen(PORT, () => console.log(`Servidor rodando na porta ${PORT}`));
