import { Request, Response } from "express";

import AdminService from "../services/admin.service";

const login = async (req: Request, res: Response): Promise<void> => {
  const loginData = req.body;

  const user = await AdminService.login(loginData, res);

  res.json({ status: "success", data: user });
};

const logout = (_req: Request, res: Response): void => {
  res.cookie("auth_token", "", {
    maxAge: 0,
    httpOnly: true,
    sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
    secure: process.env.NODE_ENV === "production",
  });
  res.status(200).json({ status: "success", message: "Вихід успішний" });
};

export const current = async (req: Request, res: Response) => {
  res.json({ status: "success", data: req.user });
};

export default {
  login,
  logout,
  current,
};
