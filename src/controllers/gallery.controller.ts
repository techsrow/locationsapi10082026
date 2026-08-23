import { Request, Response } from "express";
import { galleryService } from "../services/gallery.service";

export const galleryController = {
  async getAll(req: Request, res: Response) {
    const gallery = await galleryService.getAll();

    res.json(gallery);
  },

  async getById(req: Request, res: Response) {
    const gallery = await galleryService.getById(
      req.params.id
    );

    if (!gallery) {
      return res.status(404).json({
        message: "Gallery image not found",
      });
    }

    res.json(gallery);
  },

  async create(
  req: Request,
  res: Response
) {
  const imageUrl = req.file
    ? `/uploads/${req.file.filename}`
    : "";

  const gallery =
    await galleryService.create({
      imageUrl,
      imageType:
        req.body.imageType,
      isActive:
        req.body.isActive === "true",
    });

  res.status(201).json(gallery);
},

//   async create(req: Request, res: Response) {
//     const gallery = await galleryService.create(
//       req.body
//     );

//     res.status(201).json(gallery);
//   },

//   async update(req: Request, res: Response) {
//     const gallery = await galleryService.update(
//       req.params.id,
//       req.body
//     );

//     res.json(gallery);
//   },

async update(
  req: Request,
  res: Response
) {
  const data: any = {
    imageType:
      req.body.imageType,
    isActive:
      req.body.isActive === "true",
  };

  if (req.file) {
    data.imageUrl =
      `/uploads/${req.file.filename}`;
  }

  const gallery =
    await galleryService.update(
      req.params.id,
      data
    );

  res.json(gallery);
},

  async delete(req: Request, res: Response) {
    await galleryService.delete(req.params.id);

    res.json({
      success: true,
      message: "Gallery image deleted",
    });
  },

  async reorder(req: Request, res: Response) {
    await galleryService.reorder(req.body);

    res.json({
      success: true,
      message: "Gallery order updated",
    });
  },

  async publicGallery(
    req: Request,
    res: Response
  ) {
    const gallery =
      await galleryService.getPublicGallery();

    res.json(gallery);
  },
};