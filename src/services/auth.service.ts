import userModel from "../models/user.model";
import bcrypt from "bcrypt";
import crypto from "crypto";
import { jwtKey } from "../utils/constant";
import jwt from "jsonwebtoken";

export const findOrCreateUser = async (profile: any): Promise<any> => {
  const user = await userModel.findOne({ email: profile.emails[0].value });

  if (user) {
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
    return response;
  } else {
    const randomPassword = crypto.randomBytes(32).toString("hex"); // 64 caracteres hexadecimales
    const hashedPassword = await bcrypt.hash(randomPassword, 12);

    const newUser = new userModel({
      googleId: profile.id,
      name: profile.displayName,
      email: profile.emails[0].value,
      password: hashedPassword,
    });

    await newUser.save();
    const token = jwt.sign({ id: newUser._id }, jwtKey as string);
    const response = {
      token: token,
      user: {
        id: newUser.id,
        name: newUser.name,
        email: newUser.email,
        rol: newUser.role,
        createdAt: newUser.createdAt,
      },
    };
    return response;
  }
};
