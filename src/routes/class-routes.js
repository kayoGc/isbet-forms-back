import ClassController from '../controller/class-controller.js';
import { createCheckMd } from '../middlewares/check-params.js';
import protectRoute from "../middlewares/protect-route.js";
import express from 'express';

const controller = new ClassController();
const classRoutes = express.Router();

const checkPost = createCheckMd({
    'name': 'string'
});
const checkPut = createCheckMd({
    
});

classRoutes.get("/", protectRoute, controller.get);
classRoutes.post("/", protectRoute, checkPost, controller.post);
classRoutes.put("/", protectRoute, checkPut, controller.put);

export default classRoutes;