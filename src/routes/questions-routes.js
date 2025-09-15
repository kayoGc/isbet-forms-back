import express from "express";
import QuestionsController from "../controller/questions-controller.js"
import protectRoute from "../middlewares/protect-route.js";

const questionsRoutes = express.Router();
const controller = new QuestionsController();

// rotas livres
questionsRoutes.get("/", controller.getAll);

// rotas protegidas
questionsRoutes.post("/", protectRoute, controller.post);
questionsRoutes.post("/batch", protectRoute, controller.postMany);
questionsRoutes.delete("/:id", protectRoute, controller.delete)
questionsRoutes.delete("/", protectRoute, controller.deleteMany);

export default questionsRoutes;