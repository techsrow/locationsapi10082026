"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const setup_controller_1 = require("../controllers/setup.controller");
const upload_1 = __importDefault(require("../middlewares/upload"));
const auth_middleware_1 = require("../middlewares/auth.middleware");
const router = (0, express_1.Router)();
const setupUpload = upload_1.default.fields([
    { name: "mainImage", maxCount: 1 },
    { name: "gallery", maxCount: 20 },
]);
/* ==================================
   ADMIN ROUTES
================================== */
router.get("/id/:id", auth_middleware_1.protect, setup_controller_1.getSetupById);
router.post("/", auth_middleware_1.protect, setupUpload, setup_controller_1.createSetup);
router.put("/:id", auth_middleware_1.protect, setupUpload, setup_controller_1.updateSetup);
router.delete("/:id", auth_middleware_1.protect, setup_controller_1.deleteSetup);
router.patch("/reorder", auth_middleware_1.protect, setup_controller_1.reorderSetups);
/* ==================================
   GALLERY ROUTES
================================== */
router.delete("/gallery/:imageId", auth_middleware_1.protect, setup_controller_1.deleteSetupGalleryImage);
router.patch("/gallery/reorder", auth_middleware_1.protect, setup_controller_1.reorderSetupGallery);
/* ==================================
   PUBLIC ROUTES
================================== */
router.get("/", setup_controller_1.getAllSetups);
router.get("/:slug", setup_controller_1.getSetupBySlug);
exports.default = router;
