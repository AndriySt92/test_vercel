import { Document } from "mongoose";

export interface Admin extends Document {
  email: string;
  password: string;
  role: "admin";
  username: string;
}

export interface DecodedToken {
  userId: string;
}
