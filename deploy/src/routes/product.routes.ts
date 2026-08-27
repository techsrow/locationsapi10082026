import express from "express";
import {
  getProducts,
  getProductById,
  getProductBySlug,
  addProduct,
  addSlot,
  updateProduct,
  deleteProduct,
  deleteSlot,
  updateSlot
} from "../controllers/product.controller";
import { protect } from "../middlewares/auth.middleware";

const router = express.Router();

// router.get("/", getProducts);

// router.get("/id/:id", getProductById);

// // router.get("/slug/:slug", getProductBySlug);

// router.get("/:slug", getProductBySlug);

// router.post("/add", addProduct);

// router.post("/add-slot", addSlot);

// router.put("/:id", updateProduct);

// router.delete("/:id", deleteProduct);

// router.delete("/slot/:id", deleteSlot);

// export default router;


router.get("/", getProducts);

router.get("/id/:id", getProductById);

router.get("/:slug", getProductBySlug);

router.post("/add", addProduct);

router.post("/add-slot", protect, addSlot);
router.put("/:id", updateProduct);

/* PUT */
router.put("/slot/:id", updateSlot);

/* DELETE SLOT FIRST */
router.delete("/slot/:id", deleteSlot);

/* DELETE PRODUCT LAST */
router.delete("/:id", deleteProduct);

export default router;