import express from "express";
import QuestionsController from "../controller/questions-controller.js"
import protectRoute from "../middlewares/protect-route.js";

const questionsRoutes = express.Router();
const controller = new QuestionsController();

// rotas livres
questionsRoutes.get("/", controller.getAll);

// rotas protegidas
questionsRoutes.post("/", protectRoute, controller.post);

export default questionsRoutes;