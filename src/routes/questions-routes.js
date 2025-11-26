import express from "express";
import QuestionsController from "../controller/questions-controller.js"
import protectRoute from "../middlewares/protect-route.js";
import { createCheckMd } from "../middlewares/check-params.js";

const questionsRoutes = express.Router();
const controller = new QuestionsController();

// middlewares que checam o body
const checkPost = createCheckMd({
    question: "string",
    type: "string",
    options: [],
    correct: [],
    exam: "string"
});

const checkPostMany = createCheckMd({
    questions: []
});

const checkDelete = createCheckMd({
    ids: [],
    examId: "string"
});

const checkPut = createCheckMd({
    questions: []
});

// rotas livres
questionsRoutes.get("/", controller.getAll);

// rotas protegidas
questionsRoutes.post("/", protectRoute, checkPost, controller.post);
questionsRoutes.post("/batch", protectRoute, checkPostMany, controller.postMany);
questionsRoutes.delete("/", protectRoute, checkDelete, controller.delete)
questionsRoutes.put("/", protectRoute, checkPut, controller.put);

export default questionsRoutes;