import { Request, Response } from "express";
import prisma from "../lib/prisma";
import * as productService from "../services/product.service";
import slugify from "slugify";



function formatSlotLabel(
  startTime: string,
  endTime: string
) {
  const format = (time: string) => {
    const [hours, minutes] =
      time.split(":").map(Number);

    const date = new Date();
    date.setHours(hours);
    date.setMinutes(minutes);

    return date.toLocaleTimeString(
      "en-US",
      {
        hour: "numeric",
        minute: "2-digit",
        hour12: true,
      }
    );
  };

  return `${format(
    startTime
  )} - ${format(endTime)}`;
}
/* ---------------------------------------------------
   GET ALL PRODUCTS
--------------------------------------------------- */

export const getProducts = async (req: Request, res: Response) => {
  try {

    const products = await prisma.product.findMany({
      include: {
        slots: true
      },
      orderBy: {
        createdAt: "desc"
      }
    });

    res.json(products);

  } catch (error) {

    res.status(500).json({
      success: false,
      message: "Server error"
    });

  }
};


/* ---------------------------------------------------
   GET PRODUCT BY ID (ADMIN USE)
--------------------------------------------------- */

export const getProductById = async (req: Request, res: Response) => {

  try {

    const { id } = req.params;

    const product = await prisma.product.findUnique({
      where: { id },
      include: {
        slots: true
      }
    });

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found"
      });
    }

    res.json(product);

  } catch (error) {

    res.status(500).json({
      success: false,
      message: "Server error"
    });

  }

};


/* ---------------------------------------------------
   GET PRODUCT BY SLUG (PUBLIC WEBSITE)
--------------------------------------------------- */

export const getProductBySlug = async (req: Request, res: Response) => {

  try {

    const { slug } = req.params;

    const product = await prisma.product.findUnique({
      where: { slug },
      include: {
        slots: true
      }
    });

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found"
      });
    }

    res.json(product);

  } catch (error) {

    res.status(500).json({
      success: false,
      message: "Server error"
    });

  }

};


/* ---------------------------------------------------
   ADD PRODUCT
--------------------------------------------------- */

export const addProduct = async (req: Request, res: Response) => {

  try {

    const { name, price, bookingAmount, slots } = req.body;

    if (!name || !price || !bookingAmount) {
      return res.status(400).json({
        success: false,
        message: "Name, price and bookingAmount are required"
      });
    }

    const product = await productService.createProduct({
      name,
      price: Number(price),
      bookingAmount: Number(bookingAmount),
      slots
    });

    res.status(201).json({
      success: true,
      product
    });

  } catch (err: any) {

    res.status(400).json({
      success: false,
      message: err.message
    });

  }

};


/* ---------------------------------------------------
   Update PRODUCT
--------------------------------------------------- */

export const updateProduct = async (req: Request, res: Response) => {
  try {

    const { id } = req.params;

    const {
      name,
      slug,
      price,
      bookingAmount
    } = req.body;

    const product = await productService.updateProduct(
      id,
      {
        name,
        slug,
        price: Number(price),
        bookingAmount: Number(bookingAmount)
      }
    );

    res.json({
      success: true,
      product
    });

  } catch (error: any) {

    console.error("Update product error:", error);

    res.status(500).json({
      success: false,
      message: error.message || "Failed to update product"
    });

  }
};


/* ---------------------------------------------------
   ADD SLOT
--------------------------------------------------- */

export const addSlot = async (req: Request, res: Response) => {

  try {

    const { productId, label, startTime, endTime } = req.body;

    if (!productId || !label || !startTime || !endTime) {
      return res.status(400).json({
        success: false,
        message: "All fields are required"
      });
    }

    if (startTime >= endTime) {
      return res.status(400).json({
        success: false,
        message: "Start time must be before end time"
      });
    }

    /* CHECK OVERLAPPING SLOTS */

   const existingSlots = await prisma.slot.findMany({
  where: { productId }
});

const overlap = existingSlots.some((slot: any) => {
  return startTime < slot.endTime && endTime > slot.startTime;
});

if (overlap) {
  return res.status(400).json({
    success: false,
    message: "Slot overlaps with existing slot"
  });
}
    const slot = await productService.createSlot({
      productId,
      label,
      startTime,
      endTime
    });

    res.status(201).json({
      success: true,
      slot
    });

  } catch (err: any) {

    res.status(400).json({
      success: false,
      message: err.message
    });

  }

};








/* ---------------------------------------------------
   DELETE PRODUCT
--------------------------------------------------- */

export const deleteProduct = async (req: Request, res: Response) => {

  try {

    const { id } = req.params;

    /* Check if bookings exist */

    const bookingCount = await prisma.booking.count({
      where: { productId: id }
    });

    if (bookingCount > 0) {
      return res.status(400).json({
        success: false,
        message: "Cannot delete product because bookings exist"
      });
    }

    /* Delete slots first */

    await prisma.slot.deleteMany({
      where: { productId: id }
    });

    /* Delete product */

    await prisma.product.delete({
      where: { id }
    });

    res.json({
      success: true
    });

  } catch (error) {

    console.error("Delete product error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to delete product"
    });

  }

};


/* ---------------------------------------------------
   DELETE SLOT
--------------------------------------------------- */

/* ---------------------------------------------------
   DELETE SLOT
--------------------------------------------------- */

export const deleteSlot = async (
  req: Request,
  res: Response
) => {
  try {
    const { id } = req.params;

    const bookingCount =
      await prisma.bookingSlot.count({
        where: {
          slotId: id,
        },
      });

    if (bookingCount > 0) {
      return res.status(400).json({
        success: false,
        message:
          "This slot cannot be deleted because bookings exist.",
      });
    }

    const lockCount =
      await prisma.slotLock.count({
        where: {
          slotId: id,
        },
      });

    if (lockCount > 0) {
      return res.status(400).json({
        success: false,
        message:
          "This slot cannot be deleted because locked dates exist.",
      });
    }

    await prisma.slot.delete({
      where: { id },
    });

    return res.json({
      success: true,
      message: "Slot deleted successfully",
    });
  } catch (error: any) {
    console.error("DELETE SLOT ERROR:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to delete slot",
    });
  }
};


/* ---------------------------------------------------
   UPDATE SLOT
--------------------------------------------------- */

export const updateSlot = async (
  req: Request,
  res: Response
) => {
  try {
    const { id } = req.params;

    const {
      startTime,
      endTime,
    } = req.body;

    if (!startTime || !endTime) {
      return res.status(400).json({
        success: false,
        message: "Start time and end time are required",
      });
    }

    if (startTime >= endTime) {
      return res.status(400).json({
        success: false,
        message: "Start time must be before end time",
      });
    }

    const slot = await prisma.slot.findUnique({
      where: { id },
    });

    if (!slot) {
      return res.status(404).json({
        success: false,
        message: "Slot not found",
      });
    }

    /* Check overlap except current slot */

    const existingSlots =
      await prisma.slot.findMany({
        where: {
          productId: slot.productId,
          NOT: {
            id,
          },
        },
      });

    const overlap = existingSlots.some(
      (s) =>
        startTime < s.endTime &&
        endTime > s.startTime
    );

    if (overlap) {
      return res.status(400).json({
        success: false,
        message:
          "Slot overlaps with existing slot",
      });
    }

    const label = formatSlotLabel(
      startTime,
      endTime
    );

    const updatedSlot =
      await prisma.slot.update({
        where: { id },
        data: {
          startTime,
          endTime,
          label,
        },
      });

    return res.json({
      success: true,
      message: "Slot updated successfully",
      slot: updatedSlot,
    });
  } catch (error: any) {
    console.error(
      "UPDATE SLOT ERROR:",
      error
    );

    return res.status(500).json({
      success: false,
      message:
        error.message ||
        "Failed to update slot",
    });
  }
};