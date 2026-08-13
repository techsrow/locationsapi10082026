import express from "express";
import { protect } from "../middlewares/auth.middleware";
import upload from "../middlewares/upload";

import {
  createProps,
  getAllProps,
  getSingleProps,
  updateProps,
  deleteProps,
  reorderProps,
} from "../controllers/props.controller";

const router = express.Router();

router.post("/", protect, upload.single("image"), createProps);

router.get("/", getAllProps);

// ADD THIS
router.get("/:id", getSingleProps);

router.put("/reorder", protect, reorderProps);

router.put("/:id", protect, upload.single("image"), updateProps);

router.delete("/:id", protect, deleteProps);

export default router;