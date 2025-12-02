import dotenv from "dotenv";
import http from "http";
dotenv.config();

import cookieParser from "cookie-parser";
import cors from "cors";
import express from "express";

import connectDB from "./config/connectDb";
import getCorsOptions from "./config/cors";
import { errorHandler } from "./middlewares";
import { AdminRoutes, BookingRoutes, PhotoRoutes } from "./routes";
import { CustomError } from "./utils";

const app = express();

const allowedOrigins = JSON.parse(process.env.ALLOWED_ORIGINS as string);

app.use(
  cors({
    origin: function (origin, callback) {
      // Allow requests with no origin (like mobile apps or curl)
      if (!origin) return callback(null, true);

      if (allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        console.warn(`CORS blocked for origin: ${origin}`);
        callback(null, false);
      }
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: [
      "Content-Type",
      "Authorization",
      "X-Requested-With",
      "X-App-Version",
      "X-Platform",
      "X-Device-ID",
      "Accept",
      "Accept-Language",
    ],
  }),
);
app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));

app.use("/api/admin", AdminRoutes);
app.use("/api/photos", PhotoRoutes);
app.use("/api/bookings", BookingRoutes);

// Define your routes
app.get("/", (req, res) => {
  res.json({ message: "Hello from Express on Vercel!" });
});

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
