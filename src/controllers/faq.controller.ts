import { Request, Response } from "express";
import prisma from "../config/prisma";

// ================= GET ALL =================
export const getFaqs = async (
  req: Request,
  res: Response
) => {
  try {
    const faqs = await prisma.fAQ.findMany({
      orderBy: {
        displayOrder: "asc",
      },
    });

    res.json(faqs);
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Fetch failed",
    });
  }
};

// ================= GET BY ID =================
export const getFaqById = async (
  req: Request,
  res: Response
) => {
  try {
    const { id } = req.params;

    const faq = await prisma.fAQ.findUnique({
      where: { id },
    });

    if (!faq) {
      return res.status(404).json({
        message: "FAQ not found",
      });
    }

    res.json(faq);
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Fetch failed",
    });
  }
};

// ================= CREATE =================
export const createFaq = async (
  req: Request,
  res: Response
) => {
  try {
    const {
      question,
      answer,
      isActive,
    } = req.body;

    if (!question || !answer) {
      return res.status(400).json({
        message: "Question and answer are required",
      });
    }

    const lastFaq = await prisma.fAQ.findFirst({
      orderBy: {
        displayOrder: "desc",
      },
    });

    const nextOrder = lastFaq
      ? lastFaq.displayOrder + 1
      : 1;

    const faq = await prisma.fAQ.create({
      data: {
        question,
        answer,
        isActive:
          isActive !== undefined
            ? Boolean(isActive)
            : true,
        displayOrder: nextOrder,
      },
    });

    res.status(201).json(faq);
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Create failed",
    });
  }
};

// ================= UPDATE =================
export const updateFaq = async (
  req: Request,
  res: Response
) => {
  try {
    const { id } = req.params;

    const existing = await prisma.fAQ.findUnique({
      where: { id },
    });

    if (!existing) {
      return res.status(404).json({
        message: "FAQ not found",
      });
    }

    const {
      question,
      answer,
      isActive,
    } = req.body;

    const updated = await prisma.fAQ.update({
      where: { id },
      data: {
        question,
        answer,
        isActive:
          isActive !== undefined
            ? Boolean(isActive)
            : existing.isActive,
      },
    });

    res.json(updated);
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Update failed",
    });
  }
};

// ================= DELETE =================
export const deleteFaq = async (
  req: Request,
  res: Response
) => {
  try {
    const { id } = req.params;

    const existing = await prisma.fAQ.findUnique({
      where: { id },
    });

    if (!existing) {
      return res.status(404).json({
        message: "FAQ not found",
      });
    }

    await prisma.fAQ.delete({
      where: { id },
    });

    res.json({
      message: "Deleted successfully",
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Delete failed",
    });
  }
};

// ================= REORDER =================
export const reorderFaqs = async (
  req: Request,
  res: Response
) => {
  try {
    const { items } = req.body;

    await Promise.all(
      items.map((item: any) =>
        prisma.fAQ.update({
          where: {
            id: item.id,
          },
          data: {
            displayOrder:
              item.displayOrder,
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