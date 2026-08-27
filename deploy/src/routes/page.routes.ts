import { Router } from "express";
import { pageController } from "../controllers/page.controller";
import { protect } from "../middlewares/auth.middleware";

const router = Router();

/*
|--------------------------------------------------------------------------
| Public Routes
|--------------------------------------------------------------------------
*/

router.get(
  "/",
  pageController.publicPages
);

router.get(
  "/slug/:slug",
  pageController.getBySlug
);

/*
|--------------------------------------------------------------------------
| Admin Routes
|--------------------------------------------------------------------------
*/

router.get(
  "/admin",
  protect,
  pageController.getAll
);

router.get(
  "/admin/:id",
  protect,
  pageController.getById
);

router.post(
  "/admin",
  protect,
  pageController.create
);

router.put(
  "/admin/:id",
  protect,
  pageController.update
);

router.delete(
  "/admin/:id",
  protect,
  pageController.delete
);

router.patch(
  "/admin/:id/toggle-publish",
  protect,
  pageController.togglePublish
);

export default router;