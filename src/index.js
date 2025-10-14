import connectDb from "./config/db.js";
import dynamicCorsConfig from "./config/cors.js";
import express, { json } from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import { config } from "dotenv";

// rotas
import examsRoutes from "./routes/exams-routes.js";
import questionsRoutes from "./routes/questions-routes.js";
import usersRoutes from "./routes/users-routes.js";
import classRoutes from "./routes/class-routes.js";

// pega variaveis de ambiente do env.local
config({ path: ".env.local" });

// config do express
const server = express();
// ativa middlewares
server.use(json());
server.use(cookieParser());
server.use(cors(dynamicCorsConfig));

try {
    // conecta banco de dados
    await connectDb();

    // rota raiz, avisa que o servidor está funcionando
    server.get("/", (req, res) => {
        res.json({ message: "Servidor está funcionando!" });
    });

    // rota para manter o servidor acordado em plataformas como o UptimeRobot
    server.get("/stay-alive", (req, res) => {
        res.status(200).send();
    })

    // configura as rotas
    server.use("/exams", examsRoutes);
    server.use("/questions", questionsRoutes);
    server.use("/", usersRoutes);
    server.use("/classes", classRoutes);

    // Inicia o servidor
    server.listen(process.env.PORT, () => {
        console.log(`Servidor está rodando na porta: ${process.env.PORT}`);
    });
} catch (err) {
    console.log("Erro iniciando servidor:", err.message);
}