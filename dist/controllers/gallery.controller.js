"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.galleryController = void 0;
const gallery_service_1 = require("../services/gallery.service");
exports.galleryController = {
    async getAll(req, res) {
        const gallery = await gallery_service_1.galleryService.getAll();
        res.json(gallery);
    },
    async getById(req, res) {
        const gallery = await gallery_service_1.galleryService.getById(req.params.id);
        if (!gallery) {
            return res.status(404).json({
                message: "Gallery image not found",
            });
        }
        res.json(gallery);
    },
    async create(req, res) {
        const imageUrl = req.file
            ? `/uploads/${req.file.filename}`
            : "";
        const gallery = await gallery_service_1.galleryService.create({
            imageUrl,
            imageType: req.body.imageType,
            isActive: req.body.isActive === "true",
        });
        res.status(201).json(gallery);
    },
    //   async create(req: Request, res: Response) {
    //     const gallery = await galleryService.create(
    //       req.body
    //     );
    //     res.status(201).json(gallery);
    //   },
    //   async update(req: Request, res: Response) {
    //     const gallery = await galleryService.update(
    //       req.params.id,
    //       req.body
    //     );
    //     res.json(gallery);
    //   },
    async update(req, res) {
        const data = {
            imageType: req.body.imageType,
            isActive: req.body.isActive === "true",
        };
        if (req.file) {
            data.imageUrl =
                `/uploads/${req.file.filename}`;
        }
        const gallery = await gallery_service_1.galleryService.update(req.params.id, data);
        res.json(gallery);
    },
    async delete(req, res) {
        await gallery_service_1.galleryService.delete(req.params.id);
        res.json({
            success: true,
            message: "Gallery image deleted",
        });
    },
    async reorder(req, res) {
        await gallery_service_1.galleryService.reorder(req.body);
        res.json({
            success: true,
            message: "Gallery order updated",
        });
    },
    async publicGallery(req, res) {
        const gallery = await gallery_service_1.galleryService.getPublicGallery();
        res.json(gallery);
    },
};
