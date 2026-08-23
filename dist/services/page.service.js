"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.pageService = void 0;
const prisma_1 = __importDefault(require("../lib/prisma"));
class PageService {
    /**
     * Admin - Get all pages
     */
    async getAll() {
        return prisma_1.default.page.findMany({
            orderBy: {
                createdAt: "desc",
            },
        });
    }
    /**
     * Admin - Get page by ID
     */
    async getById(id) {
        return prisma_1.default.page.findUnique({
            where: { id },
        });
    }
    /**
     * Public - Get page by slug
     */
    async getBySlug(slug) {
        return prisma_1.default.page.findFirst({
            where: {
                slug,
                isPublished: true,
            },
        });
    }
    /**
     * Public - Get all published pages
     */
    async getPublishedPages() {
        return prisma_1.default.page.findMany({
            where: {
                isPublished: true,
            },
            select: {
                id: true,
                title: true,
                slug: true,
                metaTitle: true,
                metaDescription: true,
                updatedAt: true,
            },
            orderBy: {
                title: "asc",
            },
        });
    }
    /**
     * Admin - Create page
     */
    async create(data) {
        const existingPage = await prisma_1.default.page.findUnique({
            where: {
                slug: data.slug,
            },
        });
        if (existingPage) {
            throw new Error("Page slug already exists");
        }
        return prisma_1.default.page.create({
            data: {
                title: data.title,
                slug: data.slug,
                content: data.content,
                metaTitle: data.metaTitle,
                metaDescription: data.metaDescription,
                isPublished: data.isPublished ?? true,
            },
        });
    }
    /**
     * Admin - Update page
     */
    async update(id, data) {
        const page = await prisma_1.default.page.findUnique({
            where: { id },
        });
        if (!page) {
            throw new Error("Page not found");
        }
        if (data.slug && data.slug !== page.slug) {
            const slugExists = await prisma_1.default.page.findUnique({
                where: {
                    slug: data.slug,
                },
            });
            if (slugExists) {
                throw new Error("Page slug already exists");
            }
        }
        return prisma_1.default.page.update({
            where: { id },
            data,
        });
    }
    /**
     * Admin - Delete page
     */
    async delete(id) {
        const page = await prisma_1.default.page.findUnique({
            where: { id },
        });
        if (!page) {
            throw new Error("Page not found");
        }
        return prisma_1.default.page.delete({
            where: { id },
        });
    }
    /**
     * Admin - Toggle Publish Status
     */
    async togglePublish(id) {
        const page = await prisma_1.default.page.findUnique({
            where: { id },
        });
        if (!page) {
            throw new Error("Page not found");
        }
        return prisma_1.default.page.update({
            where: { id },
            data: {
                isPublished: !page.isPublished,
            },
        });
    }
}
exports.pageService = new PageService();
