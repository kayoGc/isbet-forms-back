import UsersController from "../controller/users-controller.js";
import { createCheckMd } from "../middlewares/check-params.js";
import express from 'express';
import { protectRouteAdmin, protectRoute } from "../middlewares/protect-route.js";

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
const checkPutAdmin = createCheckMd({
    userUid: "string"
});

// normal user
usersRoutes.post("/auth/register", checkRegister, controller.register);
usersRoutes.get("/users/:uid", protectRoute, controller.getByUid);

// admin
usersRoutes.get("/users", protectRouteAdmin, controller.get);
usersRoutes.put("/users", protectRouteAdmin, checkPut, controller.put);
usersRoutes.put("/users/admin", protectRouteAdmin, checkPutAdmin, controller.putAdminStatus);

export default usersRoutes;