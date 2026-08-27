import { Request, Response } from "express";
import { pageService } from "../services/page.service";

class PageController {
  /**
   * Public - Get all published pages
   * GET /api/pages
   */
  publicPages = async (_req: Request, res: Response) => {
    try {
      const pages = await pageService.getPublishedPages();

      res.status(200).json({
        success: true,
        data: pages,
      });
    } catch (error: any) {
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
  getBySlug = async (req: Request, res: Response) => {
    try {
      const { slug } = req.params;

      const page = await pageService.getBySlug(slug);

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
    } catch (error: any) {
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
  getAll = async (_req: Request, res: Response) => {
    try {
      const pages = await pageService.getAll();

      res.status(200).json({
        success: true,
        data: pages,
      });
    } catch (error: any) {
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
  getById = async (req: Request, res: Response) => {
    try {
      const { id } = req.params;

      const page = await pageService.getById(id);

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
    } catch (error: any) {
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
  create = async (req: Request, res: Response) => {
    try {
      const page = await pageService.create(req.body);

      return res.status(201).json({
        success: true,
        message: "Page created successfully",
        data: page,
      });
    } catch (error: any) {
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
  update = async (req: Request, res: Response) => {
    try {
      const { id } = req.params;

      const page = await pageService.update(id, req.body);

      return res.status(200).json({
        success: true,
        message: "Page updated successfully",
        data: page,
      });
    } catch (error: any) {
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
  delete = async (req: Request, res: Response) => {
    try {
      const { id } = req.params;

      await pageService.delete(id);

      return res.status(200).json({
        success: true,
        message: "Page deleted successfully",
      });
    } catch (error: any) {
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
  togglePublish = async (req: Request, res: Response) => {
    try {
      const { id } = req.params;

      const page = await pageService.togglePublish(id);

      return res.status(200).json({
        success: true,
        message: "Page status updated successfully",
        data: page,
      });
    } catch (error: any) {
      return res.status(400).json({
        success: false,
        message: error.message || "Failed to update status",
      });
    }
  };
}

export const pageController = new PageController();