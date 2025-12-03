import { CookieOptions, Response } from "express";
import jwt from "jsonwebtoken";

interface ExtendedCookieOptions extends CookieOptions {
  partitioned?: boolean;
  sameParty?: boolean;
}

const generateTokenAndSetCookie = ({ userId, res }: { userId: string; res: Response }): void => {
  const token = jwt.sign({ userId }, process.env.JWT_SECRET_KEY as string, {
    expiresIn: "2d",
  });

  const isProduction = process.env.NODE_ENV === "production";

  const cookieOptions: ExtendedCookieOptions = {
    maxAge: 2 * 24 * 60 * 60 * 1000, // 2 days
    httpOnly: true,
    secure: isProduction,
    sameSite: isProduction ? "none" : "lax",
    path: "/",
  };

  // Safari ITP workaround
  if (isProduction) {
    cookieOptions.partitioned = true; // Safari 17+ cross-site tracking prevention
    cookieOptions.sameParty = true; // Chrome's SameParty attribute
  }

  // Set cookie
  res.cookie("auth_token", token, cookieOptions as CookieOptions);
  res.setHeader("X-Auth-Token", token);
};

export default generateTokenAndSetCookie;
