import UsersController from "../controller/users-controller.js";
import { createCheckMd } from "../middlewares/check-params.js";
import express from 'express';
import protectRoute from "../middlewares/protect-route.js";

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
usersRoutes.get("/users", protectRoute, controller.get);
usersRoutes.get("/users/:uid", protectRoute, controller.getByUid);
usersRoutes.put("/users", protectRoute, checkPut, controller.put);
usersRoutes.post("/auth/register", checkRegister, controller.register);

export default usersRoutes;