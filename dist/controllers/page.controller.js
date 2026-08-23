"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.pageController = void 0;
const page_service_1 = require("../services/page.service");
class PageController {
    constructor() {
        /**
         * Public - Get all published pages
         * GET /api/pages
         */
        this.publicPages = async (_req, res) => {
            try {
                const pages = await page_service_1.pageService.getPublishedPages();
                res.status(200).json({
                    success: true,
                    data: pages,
                });
            }
            catch (error) {
                res.status(500).json({
                    success: false,
                    message: error.message || "Failed to fetch pages",
                });
            }
        };
        /**
         * Public - Get page by slug
         * GET /api/pages/slug/:slug
         */
        this.getBySlug = async (req, res) => {
            try {
                const { slug } = req.params;
                const page = await page_service_1.pageService.getBySlug(slug);
                if (!page) {
                    return res.status(404).json({
                        success: false,
                        message: "Page not found",
                    });
                }
                return res.status(200).json({
                    success: true,
                    data: page,
                });
            }
            catch (error) {
                return res.status(500).json({
                    success: false,
                    message: error.message || "Failed to fetch page",
                });
            }
        };
        /**
         * Admin - Get all pages
         * GET /api/pages/admin
         */
        this.getAll = async (_req, res) => {
            try {
                const pages = await page_service_1.pageService.getAll();
                res.status(200).json({
                    success: true,
                    data: pages,
                });
            }
            catch (error) {
                res.status(500).json({
                    success: false,
                    message: error.message || "Failed to fetch pages",
                });
            }
        };
        /**
         * Admin - Get page by ID
         * GET /api/pages/admin/:id
         */
        this.getById = async (req, res) => {
            try {
                const { id } = req.params;
                const page = await page_service_1.pageService.getById(id);
                if (!page) {
                    return res.status(404).json({
                        success: false,
                        message: "Page not found",
                    });
                }
                return res.status(200).json({
                    success: true,
                    data: page,
                });
            }
            catch (error) {
                return res.status(500).json({
                    success: false,
                    message: error.message || "Failed to fetch page",
                });
            }
        };
        /**
         * Admin - Create page
         * POST /api/pages/admin
         */
        this.create = async (req, res) => {
            try {
                const page = await page_service_1.pageService.create(req.body);
                return res.status(201).json({
                    success: true,
                    message: "Page created successfully",
                    data: page,
                });
            }
            catch (error) {
                return res.status(400).json({
                    success: false,
                    message: error.message || "Failed to create page",
                });
            }
        };
        /**
         * Admin - Update page
         * PUT /api/pages/admin/:id
         */
        this.update = async (req, res) => {
            try {
                const { id } = req.params;
                const page = await page_service_1.pageService.update(id, req.body);
                return res.status(200).json({
                    success: true,
                    message: "Page updated successfully",
                    data: page,
                });
            }
            catch (error) {
                return res.status(400).json({
                    success: false,
                    message: error.message || "Failed to update page",
                });
            }
        };
        /**
         * Admin - Delete page
         * DELETE /api/pages/admin/:id
         */
        this.delete = async (req, res) => {
            try {
                const { id } = req.params;
                await page_service_1.pageService.delete(id);
                return res.status(200).json({
                    success: true,
                    message: "Page deleted successfully",
                });
            }
            catch (error) {
                return res.status(400).json({
                    success: false,
                    message: error.message || "Failed to delete page",
                });
            }
        };
        /**
         * Admin - Toggle publish status
         * PATCH /api/pages/admin/:id/toggle-publish
         */
        this.togglePublish = async (req, res) => {
            try {
                const { id } = req.params;
                const page = await page_service_1.pageService.togglePublish(id);
                return res.status(200).json({
                    success: true,
                    message: "Page status updated successfully",
                    data: page,
                });
            }
            catch (error) {
                return res.status(400).json({
                    success: false,
                    message: error.message || "Failed to update status",
                });
            }
        };
    }
}
exports.pageController = new PageController();
