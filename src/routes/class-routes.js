import ClassController from '../controller/class-controller.js';
import { createCheckMd } from '../middlewares/check-params.js';
import { protectRouteAdmin, protectRoute } from '../middlewares/protect-route.js';
import express from 'express';

const controller = new ClassController();
const classRoutes = express.Router();

const checkPost = createCheckMd({
    'name': 'string'
});
const checkPut = createCheckMd({
    
});

// normal user
classRoutes.get("/", protectRoute, controller.get);

// admin
classRoutes.post("/", protectRouteAdmin, checkPost, controller.post);
classRoutes.put("/", protectRouteAdmin, checkPut, controller.put);

export default classRoutes;