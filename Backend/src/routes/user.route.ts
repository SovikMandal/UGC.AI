import express from "express";
import { protect } from "../middlewares/auth.js";
import { getAllProjects, getProjectById, getUserCredits } from "../controllers/user.controller.js";

const router = express.Router()

router.get('/credits', protect, getUserCredits);
router.get('/projects', protect, getAllProjects);
router.get('/projects/:projectId', protect, getProjectById);
router.get('/publish/:projectId', protect, getProjectById);

export default router;