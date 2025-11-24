import dotenv from "dotenv";
import http from "http";
dotenv.config();

import cookieParser from "cookie-parser";
import cors from "cors";
import express from "express";

import connectDB from "./config/connectDb";
import { errorHandler } from "./middlewares";
import { AdminRoutes, BookingRoutes, PhotoRoutes } from "./routes";
import { CustomError } from "./utils";

const app = express();

const allowedOrigins =
  process.env.NODE_ENV === "production"
    ? [process.env.FRONTEND_URL as string]
    : ["http://localhost:5173"];

// Middleware
app.use(
  cors({
    origin: allowedOrigins,
    credentials: true,
  }),
);
app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));

app.use("/api/admin", AdminRoutes);
app.use("/api/photos", PhotoRoutes);
app.use("/api/bookings", BookingRoutes);

app.all("*", (req, _res, next): void => {
  const error = new CustomError(`Route ${req.originalUrl} not found`, 404);
  next(error);
});

app.use(errorHandler);

// Database connection
connectDB();

const PORT = process.env.PORT || 5000;

const server = http.createServer(app);

server.listen(PORT, () => {
  console.log(`Server is listening on port ${PORT}`);
});

export default app;
