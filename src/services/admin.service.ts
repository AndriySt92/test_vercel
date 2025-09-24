import bcrypt from "bcryptjs";
import { Response } from "express";

import { LoginData } from "../dto";
import Admin from "../models/admin.model";
import type { Admin as AdminType } from "../types";
import { CustomError, generateTokenAndSetCookie } from "../utils";

const login = async (loginData: LoginData, res: Response): Promise<AdminType> => {
  const user = await Admin.findOne({ email: loginData.email });

  if (!user) {
    throw new CustomError("Неправильний пароль або логін", 400);
  }

  const isPasswordCorrect = await bcrypt.compare(loginData.password, user.password);

  if (!isPasswordCorrect) {
    throw new CustomError("Неправильний пароль або логін", 400);
  }

  generateTokenAndSetCookie({ userId: user._id, res });
  // Exclude the password from the user object before returning
  const { password: _password, ...userWithoutPassword } = user.toObject();

  return userWithoutPassword as Admin;
};

export default {
  login,
};
