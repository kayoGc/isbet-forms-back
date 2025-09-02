import UsersController from "../controller/users-controller.js";
import protectRoute from "../middlewares/protect-route.js";
import express from 'express';

const controller = new UsersController();
const usersRoutes = express.Router();

// rotas livres
usersRoutes.post("/login", controller.login);

// rotas protegidas
usersRoutes.post("/register", protectRoute, controller.register);

export default usersRoutes;