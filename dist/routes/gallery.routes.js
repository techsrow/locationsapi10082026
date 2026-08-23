"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const gallery_controller_1 = require("../controllers/gallery.controller");
const auth_middleware_1 = require("../middlewares/auth.middleware");
const upload_1 = __importDefault(require("../middlewares/upload"));
const router = (0, express_1.Router)();
/* Public */
router.get("/", gallery_controller_1.galleryController.publicGallery);
/* Admin */
router.get("/admin", auth_middleware_1.protect, gallery_controller_1.galleryController.getAll);
/* MUST BE BEFORE /admin/:id */
router.put("/admin/reorder", auth_middleware_1.protect, gallery_controller_1.galleryController.reorder);
router.get("/admin/:id", auth_middleware_1.protect, gallery_controller_1.galleryController.getById);
router.post("/admin", auth_middleware_1.protect, upload_1.default.single("image"), gallery_controller_1.galleryController.create);
router.put("/admin/:id", auth_middleware_1.protect, upload_1.default.single("image"), gallery_controller_1.galleryController.update);
router.delete("/admin/:id", auth_middleware_1.protect, gallery_controller_1.galleryController.delete);
exports.default = router;
