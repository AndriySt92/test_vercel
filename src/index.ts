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

const allowedOrigins = [
  "http://localhost:5173",
  "https://andriyst92.github.io",
  "https://test-vercel-six-beryl-85.vercel.app",
];

// app.use(
//   cors({
//     origin: function (origin, callback) {
//       // Allow requests with no origin (like mobile apps or Postman)
//       if (!origin) return callback(null, true);

//       if (allowedOrigins.indexOf(origin) !== -1) {
//         callback(null, true);
//       } else {
//         // For development, you might want to log this instead of throwing error
//         console.warn(`CORS blocked for origin: ${origin}`);
//         callback(null, false); // Return false instead of error
//       }
//     },
//     credentials: true,
//   }),
// );

app.use(
  cors({
    origin: allowedOrigins,
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization", "Cookie"],
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
