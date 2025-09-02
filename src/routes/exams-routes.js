import express from "express";
import ExamsController from "../controller/exams-controller.js";
import protectRoute from "../middlewares/protect-route.js";

const examsRoutes = express.Router();
const controller = new ExamsController();

// rotas livres
examsRoutes.get("/", controller.getAll);
examsRoutes.get("/:id", controller.getById);

// rotas protegidas
examsRoutes.post("/", protectRoute, controller.post);

export default examsRoutes;