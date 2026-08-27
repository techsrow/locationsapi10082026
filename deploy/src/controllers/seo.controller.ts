import { Request, Response } from "express";
import prisma from "../lib/prisma";

/**
 * GET ALL SEO PAGES
 */
export const getAllSeoPages = async (
  req: Request,
  res: Response
) => {
  try {
    const pages = await prisma.seoPage.findMany({
      orderBy: {
        pageKey: "asc",
      },
    });

    return res.status(200).json({
      success: true,
      data: pages,
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch SEO pages",
    });
  }
};

/**
 * GET SINGLE SEO PAGE
 */
export const getSeoByPageKey = async (
  req: Request,
  res: Response
) => {
  try {
    const { pageKey } = req.params;

    const seo = await prisma.seoPage.findUnique({
      where: {
        pageKey,
      },
    });

    if (!seo) {
      return res.status(404).json({
        success: false,
        message: "SEO page not found",
      });
    }

    return res.status(200).json({
      success: true,
      data: seo,
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch SEO page",
    });
  }
};

/**
 * CREATE SEO PAGE
 */
export const createSeoPage = async (
  req: Request,
  res: Response
) => {
  try {
    const {
      pageKey,
      metaTitle,
      metaDescription,
    } = req.body;

    const existing = await prisma.seoPage.findUnique({
      where: {
        pageKey,
      },
    });

    if (existing) {
      return res.status(400).json({
        success: false,
        message: "Page key already exists",
      });
    }

    const ogImage = req.file
      ? `/uploads/${req.file.filename}`
      : null;

    const seo = await prisma.seoPage.create({
      data: {
        pageKey,
        metaTitle,
        metaDescription,
        ogImage,
      },
    });

    return res.status(201).json({
      success: true,
      data: seo,
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      success: false,
      message: "Failed to create SEO page",
    });
  }
};

/**
 * UPDATE SEO PAGE
 */
export const updateSeoPage = async (
  req: Request,
  res: Response
) => {
  try {
    const { pageKey } = req.params;

    const existing =
      await prisma.seoPage.findUnique({
        where: {
          pageKey,
        },
      });

    if (!existing) {
      return res.status(404).json({
        success: false,
        message: "SEO page not found",
      });
    }

    const {
      metaTitle,
      metaDescription,
    } = req.body;

    const ogImage = req.file
      ? `/uploads/${req.file.filename}`
      : existing.ogImage;

    const seo = await prisma.seoPage.update({
      where: {
        pageKey,
      },
      data: {
        metaTitle,
        metaDescription,
        ogImage,
      },
    });

    return res.status(200).json({
      success: true,
      data: seo,
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      success: false,
      message: "Failed to update SEO page",
    });
  }
};

/**
 * DELETE SEO PAGE
 */
export const deleteSeoPage = async (
  req: Request,
  res: Response
) => {
  try {
    const { pageKey } = req.params;

    const existing =
      await prisma.seoPage.findUnique({
        where: {
          pageKey,
        },
      });

    if (!existing) {
      return res.status(404).json({
        success: false,
        message: "SEO page not found",
      });
    }

    await prisma.seoPage.delete({
      where: {
        pageKey,
      },
    });

    return res.status(200).json({
      success: true,
      message:
        "SEO page deleted successfully",
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      success: false,
      message: "Failed to delete SEO page",
    });
  }
};