import UsersController from "../controller/users-controller.js";
import { createCheckMd } from "../middlewares/check-params.js";
import express from 'express';

const controller = new UsersController();
const usersRoutes = express.Router();
const checkRegister = createCheckMd({
    name: "string",
    password: "string",
    email: "string"
});
const checkPut = createCheckMd({
    users: []
});

// rotas livres
usersRoutes.get("/users", controller.get);
usersRoutes.put("/users", checkPut, controller.put);
usersRoutes.post("/auth/register", checkRegister, controller.register);

export default usersRoutes;