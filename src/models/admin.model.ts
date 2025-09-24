import bcrypt from "bcryptjs";
import mongoose from "mongoose";

import { Admin } from "../types/admin.interface";

const adminSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    minlength: [3, "Name must be at least 3 characters"],
    maxlength: [100, "Name must be at least 100 characters"],
    unique: true,
  },
  email: {
    type: String,
    required: [true, "Email is required"],
    unique: true,
    match: [/^\S+@\S+\.\S+$/, "Invalid email format"],
  },
  password: {
    type: String,
    required: [true, "Password is required"],
    minlength: [6, "Password must be at least 6 characters"],
  },
  role: {
    type: String,
    enum: ["admin"],
    default: "admin",
  },
});

adminSchema.pre("save", async function (next) {
  if (this.isModified("password")) {
    this.password = await bcrypt.hash(this.password, 8);
  }
  next();
});

adminSchema.methods.isValidPassword = async function (password: string): Promise<boolean> {
  return bcrypt.compare(password, this.password);
};

const Admin = mongoose.model<Admin>("Admin", adminSchema);

export default Admin;
