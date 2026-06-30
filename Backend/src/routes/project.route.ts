import express from "express";
import { protect } from "../middlewares/auth.js";
import { createProject, createVideo, deleteProject, getAllPublishedProject } from "../controllers/project.controller.js";
import upload from "../config/multer.js";

const router = express.Router();

router.post('/create', upload.array('images', 2), protect, createProject);
router.post('/video', protect, createVideo);
router.get('/published', getAllPublishedProject);
router.get('/published', protect, deleteProject);

export default router;