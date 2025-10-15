import ClassController from '../controller/class-controller.js';
import { createCheckMd } from '../middlewares/check-params.js';
import protectRoute from "../middlewares/protect-route.js";
import express from 'express';

const controller = new ClassController();
const classRoutes = express.Router();

const checkPost = createCheckMd(['name']);
const checkPut = createCheckMd({
    
});

classRoutes.get("/", controller.get);
classRoutes.post("/", checkPost, controller.post);
classRoutes.put("/", checkPut, controller.put);

export default classRoutes;