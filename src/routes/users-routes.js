import UsersController from "../controller/users-controller.js";
import protectRoute from "../middlewares/protect-route.js";
import express from 'express';

const controller = new UsersController();
const usersRoutes = express.Router();

// rotas livres
usersRoutes.get("/users", controller.get);
usersRoutes.post("/auth/register", controller.register);

export default usersRoutes;