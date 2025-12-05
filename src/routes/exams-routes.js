import express from "express";
import ExamsController from "../controller/exams-controller.js";
// import protectRoute from "../middlewares/protect-route.js";
import { protectRoute, protectRouteAdmin } from '../middlewares/protect-route.js';
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

// normal user
examsRoutes.get("/", protectRoute, controller.getAll);
examsRoutes.get("/:id", protectRoute, controller.getById);

// admin
examsRoutes.post("/", protectRouteAdmin, checkPost, controller.post);
examsRoutes.put("/:id", protectRouteAdmin, checkPut, controller.put);

export default examsRoutes;