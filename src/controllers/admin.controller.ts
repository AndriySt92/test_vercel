import { CookieOptions, Request, Response } from "express";

import AdminService from "../services/admin.service";

interface ExtendedCookieOptions extends CookieOptions {
  partitioned?: boolean;
  sameParty?: boolean;
}

const login = async (req: Request, res: Response): Promise<void> => {
  const loginData = req.body;

  const user = await AdminService.login(loginData, res);

  res.json({ status: "success", data: user });
};

const logout = (_req: Request, res: Response): void => {
  const isProduction = process.env.NODE_ENV === "production";

  const cookieOptions: ExtendedCookieOptions = {
    maxAge: 0,
    httpOnly: true,
    secure: isProduction,
    sameSite: isProduction ? "none" : "lax",
    path: "/",
  };

  if (isProduction) {
    cookieOptions.partitioned = true;
    cookieOptions.sameParty = true;
  }

  res.cookie("auth_token", "", cookieOptions as CookieOptions);
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
