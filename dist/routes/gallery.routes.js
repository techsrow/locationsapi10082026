"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const gallery_controller_1 = require("../controllers/gallery.controller");
const router = (0, express_1.Router)();
/*
|--------------------------------------------------------------------------
| Public
|--------------------------------------------------------------------------
*/
router.get("/", gallery_controller_1.galleryController.publicGallery);
/*
|--------------------------------------------------------------------------
| Admin
|--------------------------------------------------------------------------
*/
router.get("/admin", gallery_controller_1.galleryController.getAll);
router.get("/admin/:id", gallery_controller_1.galleryController.getById);
router.post("/admin", gallery_controller_1.galleryController.create);
router.put("/admin/:id", gallery_controller_1.galleryController.update);
router.delete("/admin/:id", gallery_controller_1.galleryController.delete);
exports.default = router;
