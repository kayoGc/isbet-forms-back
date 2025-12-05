import ActiveController from '../controller/active-controller.js';
import { createCheckMd } from '../middlewares/check-params.js';
import { protectRouteAdmin, protectRoute } from '../middlewares/protect-route.js';
import express from 'express';

const controller = new ActiveController();
const activeRoutes = express.Router();

const checkPost = createCheckMd({
    'classId': 'string',
    'exam': 'string'
});
// const checkPut = createCheckMd({
    
// });

// normal user
activeRoutes.get("/", protectRoute, controller.get);

// admin
activeRoutes.post("/", protectRouteAdmin, checkPost, controller.post);
// activeRoutes.put("/", checkPut, controller.put);

export default activeRoutes;