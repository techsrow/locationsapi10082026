"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.reorderSetupGallery = exports.deleteSetupGalleryImage = exports.getSetupById = exports.reorderSetups = exports.deleteSetup = exports.updateSetup = exports.getSetupBySlug = exports.getAllSetups = exports.createSetup = void 0;
const prisma_1 = __importDefault(require("../config/prisma"));
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const slugify_1 = __importDefault(require("slugify"));
/* ================= CREATE ================= */
const createSetup = async (req, res) => {
    try {
        const { title, content, pageUrl } = req.body;
        const files = req.files;
        if (!title?.trim()) {
            return res.status(400).json({
                message: "Title is required",
            });
        }
        if (!pageUrl?.trim()) {
            return res.status(400).json({
                message: "Page URL is required",
            });
        }
        if (!files?.mainImage?.[0]) {
            return res.status(400).json({
                message: "Main image is required",
            });
        }
        const slug = (0, slugify_1.default)(title.trim(), {
            lower: true,
            strict: true,
        });
        /* ==========================
           CHECK DUPLICATE SLUG
        ========================== */
        const existingSlug = await prisma_1.default.setup.findUnique({
            where: {
                slug,
            },
        });
        if (existingSlug) {
            return res.status(400).json({
                message: "Slug already exists",
            });
        }
        /* ==========================
           CHECK DUPLICATE PAGE URL
        ========================== */
        const existingPageUrl = await prisma_1.default.setup.findUnique({
            where: {
                pageUrl: pageUrl.trim(),
            },
        });
        if (existingPageUrl) {
            return res.status(400).json({
                message: "Page URL already exists",
            });
        }
        /* ==========================
           AUTO DISPLAY ORDER
        ========================== */
        const lastSetup = await prisma_1.default.setup.findFirst({
            orderBy: {
                displayOrder: "desc",
            },
        });
        const newOrder = lastSetup
            ? lastSetup.displayOrder + 1
            : 1;
        /* ==========================
           CREATE SETUP
        ========================== */
        const setup = await prisma_1.default.setup.create({
            data: {
                title: title.trim(),
                pageUrl: pageUrl.trim(),
                slug,
                content: content || "",
                mainImage: `/uploads/${files.mainImage[0].filename}`,
                displayOrder: newOrder,
                gallery: {
                    create: files.gallery?.map((file, index) => ({
                        imageUrl: `/uploads/${file.filename}`,
                        displayOrder: index + 1,
                    })) || [],
                },
            },
            include: {
                gallery: {
                    orderBy: {
                        displayOrder: "asc",
                    },
                },
            },
        });
        return res.status(201).json({
            success: true,
            message: "Setup created successfully",
            data: setup,
        });
    }
    catch (error) {
        console.error("Create Setup Error:", error);
        return res.status(500).json({
            success: false,
            message: "Server Error",
        });
    }
};
exports.createSetup = createSetup;
/* ================= GET ALL ================= */
const getAllSetups = async (_req, res) => {
    try {
        const setups = await prisma_1.default.setup.findMany({
            orderBy: { displayOrder: "asc" },
            include: {
                gallery: {
                    orderBy: { displayOrder: "asc" },
                },
            },
        });
        res.json(setups);
    }
    catch (error) {
        res.status(500).json({ message: "Server Error" });
    }
};
exports.getAllSetups = getAllSetups;
/* ================= GET BY SLUG ================= */
const getSetupBySlug = async (req, res) => {
    try {
        const { slug } = req.params;
        const setup = await prisma_1.default.setup.findUnique({
            where: { slug },
            include: {
                gallery: {
                    orderBy: { displayOrder: "asc" },
                },
            },
        });
        if (!setup) {
            return res.status(404).json({ message: "Not found" });
        }
        res.json(setup);
    }
    catch (error) {
        res.status(500).json({ message: "Server Error" });
    }
};
exports.getSetupBySlug = getSetupBySlug;
/* ================= UPDATE ================= */
const updateSetup = async (req, res) => {
    try {
        const { id } = req.params;
        const { title, content, pageUrl } = req.body;
        const existing = await prisma_1.default.setup.findUnique({
            where: { id },
            include: {
                gallery: true,
            },
        });
        if (!existing) {
            return res.status(404).json({
                message: "Setup not found",
            });
        }
        const files = req.files;
        let updatedMainImage = existing.mainImage;
        /* ==========================
           REPLACE MAIN IMAGE
        ========================== */
        if (files?.mainImage?.[0]) {
            const oldPath = path_1.default.join(process.cwd(), existing.mainImage.replace(/^\//, ""));
            if (fs_1.default.existsSync(oldPath)) {
                fs_1.default.unlinkSync(oldPath);
            }
            updatedMainImage =
                `/uploads/${files.mainImage[0].filename}`;
        }
        /* ==========================
           ADD NEW GALLERY IMAGES
        ========================== */
        if (files?.gallery?.length) {
            const lastGallery = await prisma_1.default.setupGallery.findFirst({
                where: {
                    setupId: id,
                },
                orderBy: {
                    displayOrder: "desc",
                },
            });
            const startOrder = lastGallery
                ? lastGallery.displayOrder + 1
                : 1;
            await prisma_1.default.setupGallery.createMany({
                data: files.gallery.map((file, index) => ({
                    imageUrl: `/uploads/${file.filename}`,
                    setupId: id,
                    displayOrder: startOrder + index,
                })),
            });
        }
        /* ==========================
           BUILD UPDATE DATA
        ========================== */
        const updateData = {
            mainImage: updatedMainImage,
        };
        /* ==========================
           TITLE + SLUG UPDATE
        ========================== */
        if (title && title !== existing.title) {
            const newSlug = (0, slugify_1.default)(title, {
                lower: true,
                strict: true,
            });
            const slugExists = await prisma_1.default.setup.findFirst({
                where: {
                    slug: newSlug,
                    NOT: {
                        id,
                    },
                },
            });
            if (slugExists) {
                return res.status(400).json({
                    message: "Slug already exists",
                });
            }
            updateData.title = title;
            updateData.slug = newSlug;
        }
        /* ==========================
           PAGE URL UPDATE
        ========================== */
        if (pageUrl &&
            pageUrl !== existing.pageUrl) {
            const pageUrlExists = await prisma_1.default.setup.findFirst({
                where: {
                    pageUrl,
                    NOT: {
                        id,
                    },
                },
            });
            if (pageUrlExists) {
                return res.status(400).json({
                    message: "Page URL already exists",
                });
            }
            updateData.pageUrl = pageUrl;
        }
        /* ==========================
           CONTENT UPDATE
        ========================== */
        if (content !== undefined) {
            updateData.content = content;
        }
        /* ==========================
           SAVE
        ========================== */
        const updated = await prisma_1.default.setup.update({
            where: {
                id,
            },
            data: updateData,
            include: {
                gallery: {
                    orderBy: {
                        displayOrder: "asc",
                    },
                },
            },
        });
        return res.json({
            success: true,
            message: "Setup updated successfully",
            data: updated,
        });
    }
    catch (error) {
        console.error("Update Setup Error:", error);
        return res.status(500).json({
            success: false,
            message: "Server Error",
        });
    }
};
exports.updateSetup = updateSetup;
/* ================= DELETE ================= */
const deleteSetup = async (req, res) => {
    try {
        const { id } = req.params;
        const setup = await prisma_1.default.setup.findUnique({
            where: { id },
            include: { gallery: true },
        });
        if (!setup) {
            return res.status(404).json({ message: "Not found" });
        }
        // delete main image
        const mainPath = path_1.default.join(process.cwd(), setup.mainImage);
        if (fs_1.default.existsSync(mainPath)) {
            fs_1.default.unlinkSync(mainPath);
        }
        // delete gallery images
        setup.gallery.forEach((img) => {
            const imgPath = path_1.default.join(process.cwd(), img.imageUrl);
            if (fs_1.default.existsSync(imgPath)) {
                fs_1.default.unlinkSync(imgPath);
            }
        });
        await prisma_1.default.setup.delete({
            where: { id },
        });
        res.json({ message: "Deleted successfully" });
    }
    catch (error) {
        res.status(500).json({ message: "Server Error" });
    }
};
exports.deleteSetup = deleteSetup;
/* ================= REORDER SETUPS ================= */
const reorderSetups = async (req, res) => {
    try {
        const updates = req.body.order || req.body;
        await Promise.all(updates.map((item) => prisma_1.default.setup.update({
            where: { id: item.id },
            data: {
                displayOrder: item.displayOrder,
            },
        })));
        res.json({ message: "Reordered successfully" });
    }
    catch (error) {
        res.status(500).json({ message: "Server Error" });
    }
};
exports.reorderSetups = reorderSetups;
const getSetupById = async (req, res) => {
    try {
        const { id } = req.params;
        const setup = await prisma_1.default.setup.findUnique({
            where: { id },
            include: {
                gallery: {
                    orderBy: { displayOrder: "asc" },
                },
            },
        });
        if (!setup) {
            return res.status(404).json({ message: "Not found" });
        }
        res.json(setup);
    }
    catch (error) {
        res.status(500).json({ message: "Server Error" });
    }
};
exports.getSetupById = getSetupById;
/* ================= DELETE GALLERY IMAGE ================= */
const deleteSetupGalleryImage = async (req, res) => {
    try {
        const { imageId } = req.params;
        const image = await prisma_1.default.setupGallery.findUnique({
            where: {
                id: imageId,
            },
        });
        if (!image) {
            return res.status(404).json({
                message: "Image not found",
            });
        }
        // Remove physical file
        const imagePath = path_1.default.join(process.cwd(), image.imageUrl.replace(/^\//, ""));
        if (fs_1.default.existsSync(imagePath)) {
            fs_1.default.unlinkSync(imagePath);
        }
        // Remove DB record
        await prisma_1.default.setupGallery.delete({
            where: {
                id: imageId,
            },
        });
        return res.json({
            success: true,
            message: "Gallery image deleted successfully",
        });
    }
    catch (error) {
        console.error("Delete Setup Gallery Error:", error);
        return res.status(500).json({
            success: false,
            message: "Server Error",
        });
    }
};
exports.deleteSetupGalleryImage = deleteSetupGalleryImage;
/* ================= REORDER GALLERY ================= */
const reorderSetupGallery = async (req, res) => {
    try {
        const updates = req.body.order || req.body;
        if (!Array.isArray(updates)) {
            return res.status(400).json({
                success: false,
                message: "Invalid order payload",
            });
        }
        await Promise.all(updates.map((item) => prisma_1.default.setupGallery.update({
            where: {
                id: item.id,
            },
            data: {
                displayOrder: item.displayOrder,
            },
        })));
        return res.json({
            success: true,
            message: "Gallery reordered successfully",
        });
    }
    catch (error) {
        console.error("Reorder Setup Gallery Error:", error);
        return res.status(500).json({
            success: false,
            message: "Server Error",
        });
    }
};
exports.reorderSetupGallery = reorderSetupGallery;
