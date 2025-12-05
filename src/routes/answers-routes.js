import AnswersController from '../controller/answers-controller.js';
import { createCheckMd } from '../middlewares/check-params.js';
import { protectRouteAdmin, protectRoute } from '../middlewares/protect-route.js';
import express from 'express';

const controller = new AnswersController();
const answersRoutes = express.Router();

const checkPost = createCheckMd({
    'exam': 'string',
    'userUid': 'string',
    'answers': []
});
const checkPut = createCheckMd({
    answers: []
});

// normal user
answersRoutes.get("/", protectRoute, controller.get);
answersRoutes.post("/", protectRoute, checkPost, controller.post);
answersRoutes.put("/", protectRoute, checkPut, controller.put);

export default answersRoutes;