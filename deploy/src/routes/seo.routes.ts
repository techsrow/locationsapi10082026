import express from "express";
import { protect } from "../middlewares/auth.middleware";
import upload from "../middlewares/upload";

import {
  createSeoPage,
  getAllSeoPages,
  getSeoByPageKey,
  updateSeoPage,
  deleteSeoPage,
} from "../controllers/seo.controller";

const router = express.Router();

router.post(
  "/",
  protect,
  upload.single("ogImage"),
  createSeoPage
);

router.put(
  "/:pageKey",
  protect,
  upload.single("ogImage"),
  updateSeoPage
);

router.delete(
  "/:pageKey",
  protect,
  deleteSeoPage
);

router.get("/", getAllSeoPages);
router.get("/:pageKey", getSeoByPageKey);

export default router;