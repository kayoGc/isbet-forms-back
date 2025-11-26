import express from "express";
import ExamsController from "../controller/exams-controller.js";
import protectRoute from "../middlewares/protect-route.js";
import { createCheckMd } from "../middlewares/check-params.js"

const examsRoutes = express.Router();
const controller = new ExamsController();
const checkPost = createCheckMd({
    // author: "string",
    name: "string",
    // available: "boolean",
});
// o middleware check sem nada pelo menos checa se tem o body
const checkPut = createCheckMd({});

// rotas livres
examsRoutes.get("/", controller.getAll);
examsRoutes.get("/:id", controller.getById);

// rotas protegidas
examsRoutes.post("/", protectRoute, checkPost, controller.post);
examsRoutes.put("/:id", protectRoute, checkPut, controller.put);

export default examsRoutes;