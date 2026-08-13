import { Router } from "express";
import {
  createSetup,
  getAllSetups,
  getSetupBySlug,
  updateSetup,
  deleteSetup,
  reorderSetups,
  getSetupById,
  deleteSetupGalleryImage,
  reorderSetupGallery,
} from "../controllers/setup.controller";

import upload from "../middlewares/upload";
import { protect } from "../middlewares/auth.middleware";

const router = Router();

const setupUpload = upload.fields([
  { name: "mainImage", maxCount: 1 },
  { name: "gallery", maxCount: 20 },
]);

/* ==================================
   ADMIN ROUTES
================================== */

router.get("/id/:id", protect, getSetupById);

router.post(
  "/",
  protect,
  setupUpload,
  createSetup
);

router.put(
  "/:id",
  protect,
  setupUpload,
  updateSetup
);

router.delete(
  "/:id",
  protect,
  deleteSetup
);

router.patch(
  "/reorder",
  protect,
  reorderSetups
);

/* ==================================
   GALLERY ROUTES
================================== */

router.delete(
  "/gallery/:imageId",
  protect,
  deleteSetupGalleryImage
);

router.patch(
  "/gallery/reorder",
  protect,
  reorderSetupGallery
);

/* ==================================
   PUBLIC ROUTES
================================== */

router.get("/", getAllSetups);

router.get("/:slug", getSetupBySlug);

export default router;