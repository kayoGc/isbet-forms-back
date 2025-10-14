import ClassController from '../controller/class-controller.js';
import { createCheckMd } from '../middlewares/check-params.js';
import protectRoute from "../middlewares/protect-route.js";
import express from 'express';

const controller = new ClassController();
const classRoutes = express.Router();
const checkRequestBody = createCheckMd(["name"]);

// rotas livres
classRoutes.post("/", protectRoute, checkRequestBody, controller.post);

export default classRoutes;