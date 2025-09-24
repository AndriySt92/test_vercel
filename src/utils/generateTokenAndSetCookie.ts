import { Response } from "express";
import jwt from "jsonwebtoken";

const generateTokenAndSetCookie = ({ userId, res }: { userId: string; res: Response }): void => {
  const token = jwt.sign({ userId }, process.env.JWT_SECRET_KEY as string, {
    expiresIn: "15d",
  });

  res.cookie("auth_token", token, {
    maxAge: 15 * 24 * 60 * 60 * 1000, // 15d
    httpOnly: true,
    sameSite: "strict",
    secure: process.env.NODE_ENV !== "development",
  });
};

export default generateTokenAndSetCookie;
