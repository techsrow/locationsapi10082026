import express from "express";
import {
  getVideos,
  getVideoById,
  createVideo,
  updateVideo,
  deleteVideo,
  reorderVideos,
} from "../controllers/videoController";
import { protect } from "../middlewares/auth.middleware";

const router = express.Router();

router.get("/", getVideos);

router.get("/:id", getVideoById);

router.post("/", protect, createVideo);

router.put("/reorder", protect, reorderVideos);

router.put("/:id", protect, updateVideo);

router.delete("/:id", protect, deleteVideo);

export default router;