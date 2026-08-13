import express from "express";
import multer from "multer";
import path from "path";

import {
  createSet,
  getAllSets,
  getSingleSet,
  updateSet,
  deleteSet,
  addSetGalleryImage,
  deleteSetGalleryImage,
  reorderSetGallery,
  reorderSets,
  getSetGallery,
} from "../controllers/setController";

const router = express.Router();

/* ================================
   MULTER CONFIG
================================ */
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/");
  },
  filename: function (req, file, cb) {
    const uniqueName =
      Date.now() +
      "-" +
      Math.round(Math.random() * 1e9) +
      path.extname(file.originalname);

    cb(null, uniqueName);
  },
});

const upload = multer({ storage });

/* ================================
   SET ROUTES
================================ */

// Create Set
router.post("/", upload.single("mainImage"), createSet);

// Get All Sets
router.get("/", getAllSets);

// Reorder Sets
router.put("/reorder", reorderSets);

// Get Single Set
router.get("/:id", getSingleSet);

// Get Gallery by Set
router.get("/:id/gallery", getSetGallery);

// Update Set
router.put("/:id", upload.single("mainImage"), updateSet);

// Delete Set
router.delete("/:id", deleteSet);

/* ================================
   GALLERY ROUTES
================================ */

// Add Gallery Image
router.post(
  "/:id/gallery",
  upload.single("image"),
  addSetGalleryImage
);

// Delete Gallery Image
router.delete(
  "/gallery/:id",
  deleteSetGalleryImage
);

// Reorder Gallery
router.put(
  "/gallery/reorder",
  reorderSetGallery
);

export default router;