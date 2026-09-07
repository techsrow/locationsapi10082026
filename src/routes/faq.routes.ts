import { Router } from "express";

import {
  getFaqs,
  getFaqById,
  createFaq,
  updateFaq,
  deleteFaq,
  reorderFaqs,
} from "../controllers/faq.controller";

const router = Router();

// GET ALL FAQs
router.get("/", getFaqs);

// GET FAQ BY ID
router.get("/:id", getFaqById);

// CREATE FAQ
router.post("/", createFaq);

// REORDER FAQs
router.put("/reorder", reorderFaqs);

// UPDATE FAQ
router.put("/:id", updateFaq);

// DELETE FAQ
router.delete("/:id", deleteFaq);

export default router;