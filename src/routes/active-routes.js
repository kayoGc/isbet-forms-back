import ActiveController from '../controller/active-controller.js';
import { createCheckMd } from '../middlewares/check-params.js';
import protectRoute from "../middlewares/protect-route.js";
import express from 'express';

const controller = new ActiveController();
const activeRoutes = express.Router();

const checkPost = createCheckMd({
    'classId': 'string',
    'exam': 'string'
});
const checkPut = createCheckMd({
    
});

activeRoutes.get("/", protectRoute, controller.get);
activeRoutes.post("/", protectRoute, checkPost, controller.post);
// activeRoutes.put("/", checkPut, controller.put);

export default activeRoutes;