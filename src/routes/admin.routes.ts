import express from "express";

import AdminController from "../controllers/admin.controller";
import { auth } from "../middlewares";
import { ctrlWrapper } from "../utils";

const router = express.Router();

router.post("/login", ctrlWrapper(AdminController.login));
router.delete("/logout", auth, ctrlWrapper(AdminController.logout));
router.get("/current", auth, ctrlWrapper(AdminController.current));

export default router;
