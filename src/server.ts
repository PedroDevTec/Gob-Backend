import express from "express";
import cors from "cors";
import userRoutes from "./routes/userRoutes";
import { PORT } from "./config/env";
const morgan = require('morgan');

const app = express();

app.use(cors());
app.use(express.json());

app.use(morgan('tiny'));

app.use("/api", userRoutes);

app.listen(PORT, () => console.log(`Servidor rodando na porta ${PORT}`));
