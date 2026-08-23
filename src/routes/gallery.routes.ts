import { Router } from "express";
import { galleryController } from "../controllers/gallery.controller";
import { protect } from "../middlewares/auth.middleware";
import upload from "../middlewares/upload";

const router = Router();

/* Public */

router.get(
  "/",
  galleryController.publicGallery
);

/* Admin */

router.get(
  "/admin",
  protect,
  galleryController.getAll
);

/* MUST BE BEFORE /admin/:id */

router.put(
  "/admin/reorder",
  protect,
  galleryController.reorder
);

router.get(
  "/admin/:id",
  protect,
  galleryController.getById
);

router.post(
  "/admin",
  protect,
  upload.single("image"),
  galleryController.create
);

router.put(
  "/admin/:id",
  protect,
  upload.single("image"),
  galleryController.update
);

router.delete(
  "/admin/:id",
  protect,
  galleryController.delete
);

export default router;