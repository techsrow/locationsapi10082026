"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const page_controller_1 = require("../controllers/page.controller");
const auth_middleware_1 = require("../middlewares/auth.middleware");
const router = (0, express_1.Router)();
/*
|--------------------------------------------------------------------------
| Public Routes
|--------------------------------------------------------------------------
*/
router.get("/", page_controller_1.pageController.publicPages);
router.get("/slug/:slug", page_controller_1.pageController.getBySlug);
/*
|--------------------------------------------------------------------------
| Admin Routes
|--------------------------------------------------------------------------
*/
router.get("/admin", auth_middleware_1.protect, page_controller_1.pageController.getAll);
router.get("/admin/:id", auth_middleware_1.protect, page_controller_1.pageController.getById);
router.post("/admin", auth_middleware_1.protect, page_controller_1.pageController.create);
router.put("/admin/:id", auth_middleware_1.protect, page_controller_1.pageController.update);
router.delete("/admin/:id", auth_middleware_1.protect, page_controller_1.pageController.delete);
router.patch("/admin/:id/toggle-publish", auth_middleware_1.protect, page_controller_1.pageController.togglePublish);
exports.default = router;
