import { Request, Response } from "express";
import prisma from "../config/prisma";
import fs from "fs";
import path from "path";
import slugify from "slugify";




/* ================= CREATE ================= */

export const createSetup = async (req: Request, res: Response) => {
  try {
    const { title, content, pageUrl } = req.body;

    const files = req.files as {
      mainImage?: Express.Multer.File[];
      gallery?: Express.Multer.File[];
    };

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

    const slug = slugify(title.trim(), {
      lower: true,
      strict: true,
    });

    /* ==========================
       CHECK DUPLICATE SLUG
    ========================== */

    const existingSlug = await prisma.setup.findUnique({
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

    const existingPageUrl = await prisma.setup.findUnique({
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

    const lastSetup = await prisma.setup.findFirst({
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

    const setup = await prisma.setup.create({
      data: {
        title: title.trim(),
        pageUrl: pageUrl.trim(),
        slug,
        content: content || "",
        mainImage: `/uploads/${files.mainImage[0].filename}`,
        displayOrder: newOrder,

        gallery: {
          create:
            files.gallery?.map((file, index) => ({
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
  } catch (error) {
    console.error("Create Setup Error:", error);

    return res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};

/* ================= GET ALL ================= */

export const getAllSetups = async (_req: Request, res: Response) => {
  try {
    const setups = await prisma.setup.findMany({
      orderBy: { displayOrder: "asc" },
      include: {
        gallery: {
          orderBy: { displayOrder: "asc" },
        },
      },
    });

    res.json(setups);
  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
};

/* ================= GET BY SLUG ================= */

export const getSetupBySlug = async (req: Request, res: Response) => {
  try {
    const { slug } = req.params;

    const setup = await prisma.setup.findUnique({
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
  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
};
/* ================= UPDATE ================= */

export const updateSetup = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { title, content, pageUrl } = req.body;

    const existing = await prisma.setup.findUnique({
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

    const files = req.files as {
      mainImage?: Express.Multer.File[];
      gallery?: Express.Multer.File[];
    };

    let updatedMainImage = existing.mainImage;

    /* ==========================
       REPLACE MAIN IMAGE
    ========================== */

    if (files?.mainImage?.[0]) {
      const oldPath = path.join(
        process.cwd(),
        existing.mainImage.replace(/^\//, "")
      );

      if (fs.existsSync(oldPath)) {
        fs.unlinkSync(oldPath);
      }

      updatedMainImage =
        `/uploads/${files.mainImage[0].filename}`;
    }

    /* ==========================
       ADD NEW GALLERY IMAGES
    ========================== */

    if (files?.gallery?.length) {
      const lastGallery = await prisma.setupGallery.findFirst({
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

      await prisma.setupGallery.createMany({
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

    const updateData: any = {
      mainImage: updatedMainImage,
    };

    /* ==========================
       TITLE + SLUG UPDATE
    ========================== */

    if (title && title !== existing.title) {
      const newSlug = slugify(title, {
        lower: true,
        strict: true,
      });

      const slugExists = await prisma.setup.findFirst({
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

    if (
      pageUrl &&
      pageUrl !== existing.pageUrl
    ) {
      const pageUrlExists =
        await prisma.setup.findFirst({
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

    const updated = await prisma.setup.update({
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
  } catch (error) {
    console.error("Update Setup Error:", error);

    return res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};


/* ================= DELETE ================= */

export const deleteSetup = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const setup = await prisma.setup.findUnique({
      where: { id },
      include: { gallery: true },
    });

    if (!setup) {
      return res.status(404).json({ message: "Not found" });
    }

    // delete main image
    const mainPath = path.join(process.cwd(), setup.mainImage);
    if (fs.existsSync(mainPath)) {
      fs.unlinkSync(mainPath);
    }

    // delete gallery images
    setup.gallery.forEach((img) => {
      const imgPath = path.join(process.cwd(), img.imageUrl);
      if (fs.existsSync(imgPath)) {
        fs.unlinkSync(imgPath);
      }
    });

    await prisma.setup.delete({
      where: { id },
    });

    res.json({ message: "Deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
};

/* ================= REORDER SETUPS ================= */

export const reorderSetups = async (req: Request, res: Response) => {
  try {
    const updates = req.body.order || req.body;

   await Promise.all(
  updates.map((item: any) =>
    prisma.setup.update({
      where: { id: item.id },
      data: {
        displayOrder: item.displayOrder,
      },
    })
  )
);

    res.json({ message: "Reordered successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
};

export const getSetupById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const setup = await prisma.setup.findUnique({
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
  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
};


/* ================= DELETE GALLERY IMAGE ================= */

export const deleteSetupGalleryImage = async (
  req: Request,
  res: Response
) => {
  try {
    const { imageId } = req.params;

    const image = await prisma.setupGallery.findUnique({
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
    const imagePath = path.join(
      process.cwd(),
      image.imageUrl.replace(/^\//, "")
    );

    if (fs.existsSync(imagePath)) {
      fs.unlinkSync(imagePath);
    }

    // Remove DB record
    await prisma.setupGallery.delete({
      where: {
        id: imageId,
      },
    });

    return res.json({
      success: true,
      message: "Gallery image deleted successfully",
    });
  } catch (error) {
    console.error("Delete Setup Gallery Error:", error);

    return res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};

/* ================= REORDER GALLERY ================= */

export const reorderSetupGallery = async (
  req: Request,
  res: Response
) => {
  try {
    const updates = req.body.order || req.body;

    if (!Array.isArray(updates)) {
      return res.status(400).json({
        success: false,
        message: "Invalid order payload",
      });
    }

    await Promise.all(
      updates.map((item: any) =>
        prisma.setupGallery.update({
          where: {
            id: item.id,
          },
          data: {
            displayOrder: item.displayOrder,
          },
        })
      )
    );

    return res.json({
      success: true,
      message: "Gallery reordered successfully",
    });
  } catch (error) {
    console.error("Reorder Setup Gallery Error:", error);

    return res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};