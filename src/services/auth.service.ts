import { User } from "../interfaces/user.interface";
import userModel from "../models/user.model";

export const findOrCreateUser = async (profile: any): Promise<User> => {
  const existingUser = await userModel.findOne({ googleId: profile.id });

  if (existingUser) {
    return existingUser;
  }

  const newUser = new userModel({
    googleId: profile.id,
    name: profile.displayName,
    email: profile.emails[0].value,
  });

  await newUser.save();
  return newUser;
};
