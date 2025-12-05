import express from "express";
import QuestionsController from "../controller/questions-controller.js"
import { createCheckMd } from "../middlewares/check-params.js";
import { protectRouteAdmin, protectRoute } from "../middlewares/protect-route.js";

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

// normal user
questionsRoutes.get("/", protectRoute, controller.getAll);

// admin 
questionsRoutes.post("/", protectRouteAdmin, checkPost, controller.post);
questionsRoutes.post("/batch", protectRouteAdmin, checkPostMany, controller.postMany);
questionsRoutes.delete("/", protectRouteAdmin, checkDelete, controller.delete)
questionsRoutes.put("/", protectRouteAdmin, checkPut, controller.put);

export default questionsRoutes;