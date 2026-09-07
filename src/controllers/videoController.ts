import { Request, Response } from "express";
import prisma from "../config/prisma";

// ================= GET ALL =================
export const getVideos = async (req: Request, res: Response) => {
  try {
    const { category } = req.query;

    const videos = await prisma.video.findMany({
      where: category
        ? {
            category: String(category) as any,
          }
        : undefined,
      orderBy: {
        displayOrder: "asc",
      },
    });

    res.json(videos);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Fetch failed" });
  }
};

// ================= GET BY ID =================
export const getVideoById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const video = await prisma.video.findUnique({
      where: { id },
    });

    if (!video) {
      return res.status(404).json({
        message: "Video not found",
      });
    }

    res.json(video);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Fetch failed" });
  }
};

// ================= CREATE =================
export const createVideo = async (req: Request, res: Response) => {
  try {
    const { title, vimeoId, category, isActive } = req.body;

    if (!vimeoId) {
      return res.status(400).json({
        message: "Vimeo ID is required",
      });
    }

    const lastVideo = await prisma.video.findFirst({
      orderBy: {
        displayOrder: "desc",
      },
    });

    const nextOrder = lastVideo
      ? lastVideo.displayOrder + 1
      : 1;

    const video = await prisma.video.create({
      data: {
        title: title || "",
        vimeoId,
        category,
        isActive:
          isActive !== undefined
            ? Boolean(isActive)
            : true,
        displayOrder: nextOrder,
      },
    });

    res.status(201).json(video);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Create failed" });
  }
};

// ================= UPDATE =================
export const updateVideo = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const existing = await prisma.video.findUnique({
      where: { id },
    });

    if (!existing) {
      return res.status(404).json({
        message: "Video not found",
      });
    }

    const { title, vimeoId, category, isActive } = req.body;

    const updated = await prisma.video.update({
      where: { id },
      data: {
        title,
        vimeoId,
        category,
        isActive:
          isActive !== undefined
            ? Boolean(isActive)
            : existing.isActive,
      },
    });

    res.json(updated);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Update failed" });
  }
};

// ================= DELETE =================
export const deleteVideo = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const existing = await prisma.video.findUnique({
      where: { id },
    });

    if (!existing) {
      return res.status(404).json({
        message: "Video not found",
      });
    }

    await prisma.video.delete({
      where: { id },
    });

    res.json({
      message: "Deleted successfully",
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Delete failed" });
  }
};

// ================= REORDER =================
export const reorderVideos = async (
  req: Request,
  res: Response
) => {
  try {
    const { items } = req.body;

    await Promise.all(
      items.map((item: any) =>
        prisma.video.update({
          where: {
            id: item.id,
          },
          data: {
            displayOrder: item.displayOrder,
          },
        })
      )
    );

    res.json({
      message: "Reordered successfully",
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Reorder failed",
    });
  }
};