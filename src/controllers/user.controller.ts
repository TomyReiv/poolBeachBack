import { Request, Response } from "express";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import { httpResponse } from "../utils/enumsError";
import { User } from "../interfaces/user.interface";
import UserService from "../services/user.service";
import { jwtKey } from "../utils/constant";

const HttpResponse = new httpResponse();
const userService = new UserService();


class UserController {
  async getUsers(req: Request, res: Response) {
    try {
      const users = await userService.getAllUsers();
      if (!users)
        return HttpResponse.DATA_BASE_ERROR(res, "Usuarios no encontrados");
      return HttpResponse.OK(res, users);
    } catch (error) {
      return HttpResponse.Error(res, (error as Error).message);
    }
  }

  async getUser(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const user = await userService.getOneUser(id);
      if (!user)
        return HttpResponse.DATA_BASE_ERROR(res, "Usuario no encontrado");
      return HttpResponse.OK(res, user);
    } catch (error) {
      return HttpResponse.Error(res, (error as Error).message);
    }
  }

  async createUser(req: Request, res: Response) {
    try {
      const user: User = req.body as User;
      const hashedPassword = await bcrypt.hash(user.password, 10);
      user.password = hashedPassword;
      const newUser = await userService.createUser(user);
      return HttpResponse.OK(res, newUser);
    } catch (error) {
      return HttpResponse.Error(res, (error as Error).message);
    }
  }

  async updateUser(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const user: User = req.body as User;
      if (user.password) {
        const hashedPassword = await bcrypt.hash(user.password, 10);
        user.password = hashedPassword;
      }
      const updatedUser = await userService.updateUser(id, user);
      if (!updatedUser)
        return HttpResponse.DATA_BASE_ERROR(res, "Usuario no encontrado");
      return HttpResponse.OK(res, updatedUser.msg);
    } catch (error) {
      return HttpResponse.Error(res, (error as Error).message);
    }
  }

  async deleteUser(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const user = await userService.deleteUser(id);
      if (!user)
        return HttpResponse.DATA_BASE_ERROR(res, "Usuario no encontrado");
      return HttpResponse.OK(res, user.msg);
    } catch (error) {
      return HttpResponse.Error(res, (error as Error).message);
    }
  }

  async login(req: Request, res: Response) {
    try {
      const { email, password } = req.body;
      if (!(email && password)) {
        return HttpResponse.INVALID_TYPE_ERROR(
          res,
          "Email y contraseña son obligatorios"
        );
      }
      const user = await userService.getUserByEmail(email);
      if (!user)
        return HttpResponse.DATA_BASE_ERROR(res, "Usuario no encontrado");
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch)
        return HttpResponse.BAD_REQUEST_ERROR(res, "Contraseña incorrecta");
      const token = jwt.sign({ id: user._id }, jwtKey as string);
      const response = {
        token: token,
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          rol: user.role,
          createdAt: user.createdAt,
        },
      };
      // Configurar la cookie con el token
      res.cookie(jwtKey as string, token, {
        maxAge: 1000 * 60 * 60, // 1 hora
        httpOnly: false,
        sameSite: "none",
      });
      return HttpResponse.OK(res, response);
    } catch (error) {
      return HttpResponse.Error(res, (error as Error).message);
    }
  }
}

export default UserController;
