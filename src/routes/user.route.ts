import { Router } from "express";
import UserController from "../controllers/user.controller";
import { handleUserValidationErrors, userValidator } from "../middlewares/user.validator";
import { isAdmin } from "../middlewares/isAdmin.middleware";

const router = Router();
const userController = new UserController();

const { getUsers, getUser, createUser, updateUser, deleteUser, login } = userController;

router.get("/", getUsers);
router.get("/:id", getUser);
router.post("/", isAdmin, handleUserValidationErrors, userValidator, createUser);
router.put("/:id", updateUser);
router.delete("/:id", deleteUser);
router.post("/login", login);


export default router;