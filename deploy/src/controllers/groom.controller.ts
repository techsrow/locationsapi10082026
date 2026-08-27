import { Request, Response } from "express";
import prisma from "../config/prisma";
import path from "path";
import fs from "fs";

// ===============================
// ✅ Upload Multiple Images
// ===============================
export const uploadGroom = async (
  req: Request,
  res: Response
) => {
  try {
    const files = req.files as Express.Multer.File[];

    const category = (
      req.body.category || "INDIAN"
    ).toUpperCase();

    if (!files || files.length === 0) {
      return res.status(400).json({
        message: "Images required",
      });
    }

    const createdImages = await Promise.all(
      files.map((file) =>
        prisma.groomGallery.create({
          data: {
            imageUrl: `/uploads/${file.filename}`,
            category,
            displayorder: 0,
          },
        })
      )
    );

    return res.status(201).json({
      message:
        "Groom images uploaded successfully",
      data: createdImages,
    });
  } catch (error) {
    console.error(
      "Upload Groom Error:",
      error
    );

    return res.status(500).json({
      message: "Upload failed",
    });
  }
};

// ===============================
// ✅ Get Images
// ===============================
export const getGroom = async (
  req: Request,
  res: Response
) => {
  try {
    const category = (
      req.query.category as string
    )?.toUpperCase();

    const data =
      await prisma.groomGallery.findMany({
        where:
          category &&
          category !== "ALL"
            ? { category }
            : {},
        orderBy: {
          displayorder: "asc",
        },
      });

    return res.status(200).json(data);
  } catch (error) {
    console.error(
      "Fetch Groom Error:",
      error
    );

    return res.status(500).json({
      message: "Fetch failed",
    });
  }
};

// ===============================
// ✅ Update Category
// ===============================
export const updateGroomCategory =
  async (
    req: Request,
    res: Response
  ) => {
    try {
      const { id } = req.params;
      const { category } = req.body;

      if (
        !category ||
        !["INDIAN", "WESTERN"].includes(
          category.toUpperCase()
        )
      ) {
        return res.status(400).json({
          message: "Invalid category",
        });
      }

      const updated =
        await prisma.groomGallery.update({
          where: { id },
          data: {
            category:
              category.toUpperCase(),
          },
        });

      return res.json({
        message:
          "Category updated successfully",
        data: updated,
      });
    } catch (error) {
      console.error(error);

      return res.status(500).json({
        message: "Update failed",
      });
    }
  };

// ===============================
// ✅ Delete Image
// ===============================
export const deleteGroomImage = async (
  req: Request,
  res: Response
) => {
  try {
    const { id } = req.params;

    const image =
      await prisma.groomGallery.findUnique({
        where: { id },
      });

    if (!image) {
      return res.status(404).json({
        message: "Image not found",
      });
    }

    const filename =
      image.imageUrl.replace(
        "/uploads/",
        ""
      );

    const uploadsPath =
      path.resolve(
        process.cwd(),
        "uploads"
      );

    const filePath = path.join(
      uploadsPath,
      filename
    );

    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }

    await prisma.groomGallery.delete({
      where: { id },
    });

    return res.status(200).json({
      message:
        "Groom image deleted successfully",
    });
  } catch (error) {
    console.error(
      "Delete Groom Error:",
      error
    );

    return res.status(500).json({
      message: "Delete failed",
    });
  }
};

// ===============================
// ✅ Reorder Images
// ===============================
export const reorderGroom = async (
  req: Request,
  res: Response
) => {
  try {
    const { items } = req.body;

    if (
      !items ||
      !Array.isArray(items)
    ) {
      return res.status(400).json({
        message:
          "Invalid reorder payload",
      });
    }

    await Promise.all(
      items.map(
        (item: {
          id: string;
          displayorder: number;
        }) =>
          prisma.groomGallery.update({
            where: {
              id: item.id,
            },
            data: {
              displayorder:
                item.displayorder,
            },
          })
      )
    );

    return res.status(200).json({
      message:
        "Reordered successfully",
    });
  } catch (error) {
    console.error(
      "Reorder Groom Error:",
      error
    );

    return res.status(500).json({
      message: "Reorder failed",
    });
  }
};