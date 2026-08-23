"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.galleryService = void 0;
const prisma_1 = __importDefault(require("../lib/prisma"));
exports.galleryService = {
    async getAll() {
        return prisma_1.default.gallery.findMany({
            orderBy: {
                displayOrder: "asc",
            },
        });
    },
    async getById(id) {
        return prisma_1.default.gallery.findUnique({
            where: { id },
        });
    },
    async create(data) {
        return prisma_1.default.gallery.create({
            data: {
                imageUrl: data.imageUrl,
                displayOrder: data.displayOrder || 0,
                imageType: data.imageType || "wide",
                isActive: data.isActive ?? true,
            },
        });
    },
    async update(id, data) {
        return prisma_1.default.gallery.update({
            where: { id },
            data,
        });
    },
    async delete(id) {
        return prisma_1.default.gallery.delete({
            where: { id },
        });
    },
    async getPublicGallery() {
        return prisma_1.default.gallery.findMany({
            where: {
                isActive: true,
            },
            orderBy: {
                displayOrder: "asc",
            },
        });
    },
};
