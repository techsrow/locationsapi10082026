import prisma from "../lib/prisma";
import { Request, Response } from "express";
import { v4 as uuidv4 } from "uuid";


/* =========================
   LOCK BOOKING (CUSTOMER)
========================= */

export const lockBooking = async (req: Request, res: Response) => {

  try {

    const {
      productId,
      date,
      slotIds,
      firstName,
      lastName,
      email,
      phone,
      address,
      city,
      state,
      postcode
    } = req.body;

    if (!productId || !date || !slotIds || !Array.isArray(slotIds)) {
      return res.status(400).json({
        message: "Invalid booking request"
      });
    }

    const bookingDate = new Date(date);

    /* =========================
       CHECK ADMIN SLOT LOCK
    ========================= */

    const lockedSlot = await prisma.slotLock.findFirst({
      where: {
        productId,
        slotId: { in: slotIds },
        date: bookingDate,
        locked: true
      }
    });

    if (lockedSlot) {
      return res.status(400).json({
        message: "This slot has been locked by admin"
      });
    }

    /* =========================
       CREATE BOOKING
    ========================= */

    const lockExpires = new Date(Date.now() + 10 * 60 * 1000);

    const booking = await prisma.booking.create({
      data: {

        bookingId: uuidv4(),

        productId,

        bookingDate,

        firstName,
        lastName,
        email,
        phone,
        address,
        city,
        state,
        postcode,

        paymentStatus: "locked",

        lockExpiresAt: lockExpires,

        slots: {
          create: slotIds.map((slotId: string) => ({
            slotId
          }))
        }

      }
    });

    return res.json({
      success: true,
      bookingId: booking.bookingId
    });

  } catch (error) {

    console.error("Lock booking error:", error);

    return res.status(500).json({
      message: "Booking lock failed"
    });

  }

};


/* =========================
   GET ALL BOOKINGS
========================= */

export const getAllBookings = async (req: Request, res: Response) => {

  try {

    const bookings = await prisma.booking.findMany({

      orderBy: {
        createdAt: "desc"
      },

      include: {
        product: true,
        slots: {
          include: {
            slot: true
          }
        }
      }

    });

    res.json(bookings);

  } catch (error) {

    console.error("Fetch bookings error:", error);

    res.status(500).json({
      message: "Error fetching bookings"
    });

  }

};


/* =========================
   GET BOOKING DETAILS
========================= */

export const getBooking = async (req: Request, res: Response) => {

  try {

    const { bookingId } = req.params;

    const booking = await prisma.booking.findUnique({

      where: { bookingId },

      include: {
        product: true,
        slots: {
          include: {
            slot: true
          }
        }

      }

    });

    if (!booking) {

      return res.status(404).json({
        message: "Booking not found"
      });

    }

    res.json(booking);

  } catch (error) {

    console.error("Booking details error:", error);

    res.status(500).json({
      message: "Error fetching booking"
    });

  }

};


/* =========================
   CALENDAR BOOKINGS
========================= */

export const getCalendarBookings = async (req: Request, res: Response) => {

  try {

    const bookings = await prisma.booking.findMany({
      include: {
        product: true,
        slots: {
          include: { slot: true }
        }
      }
    });

    const events = bookings.flatMap((booking: any) =>
      booking.slots.map((s: any) => {

        const date = new Date(booking.bookingDate);

        const start = new Date(date);
        const end = new Date(date);

        const [sh, sm] = s.slot.startTime.split(":");
        const [eh, em] = s.slot.endTime.split(":");

        start.setHours(Number(sh), Number(sm), 0, 0);
        end.setHours(Number(eh), Number(em), 0, 0);

        const customerName =
          `${booking.firstName ?? ""} ${booking.lastName ?? ""}`.trim() || "Customer";

        return {
          title: `${booking.product.name} - ${customerName}`,
          start,
          end,
          bookingId: booking.bookingId
        };

      })
    );

    res.json(events);

  } catch (error) {

    console.error("Calendar booking error:", error);

    res.status(500).json({
      message: "Error loading calendar bookings"
    });

  }

};




/* =========================
   ADMIN LOCK DATE
========================= */

export const lockDateByAdmin = async (
  req: Request,
  res: Response
) => {
  try {
    const { productId, date } = req.body;

    if (!date) {
      return res.status(400).json({
        success: false,
        message: "Date is required",
      });
    }

    const bookingDate = new Date(date);

    let slots: {
      id: string;
      productId: string;
    }[] = [];

    /* -------------------------
       ALL PRODUCTS
    -------------------------- */

    if (!productId || productId === "ALL") {
      slots = await prisma.slot.findMany({
        select: {
          id: true,
          productId: true,
        },
      });
    }

    /* -------------------------
       SINGLE PRODUCT
    -------------------------- */

    else {
      slots = await prisma.slot.findMany({
        where: {
          productId,
        },
        select: {
          id: true,
          productId: true,
        },
      });
    }

    if (!slots.length) {
      return res.status(404).json({
        success: false,
        message: "No slots found",
      });
    }

    /* -------------------------
       REMOVE DUPLICATES
    -------------------------- */

    const existingLocks = await prisma.slotLock.findMany({
      where: {
        date: bookingDate,
        slotId: {
          in: slots.map((s) => s.id),
        },
      },
      select: {
        slotId: true,
      },
    });

    const lockedSlotIds = new Set(
      existingLocks.map((l) => l.slotId)
    );

    const slotsToLock = slots.filter(
      (slot) => !lockedSlotIds.has(slot.id)
    );

    if (!slotsToLock.length) {
      return res.json({
        success: true,
        message: "Date already locked",
        totalLocked: 0,
      });
    }

    /* -------------------------
       CREATE LOCKS
    -------------------------- */

    const locks = await prisma.$transaction(
      slotsToLock.map((slot) =>
        prisma.slotLock.create({
          data: {
            productId: slot.productId,
            slotId: slot.id,
            date: bookingDate,
            locked: true,
          },
        })
      )
    );

    return res.json({
      success: true,
      message:
        !productId || productId === "ALL"
          ? "Date locked for all products"
          : "Date locked successfully",
      totalLocked: locks.length,
      lockedDate: date,
    });
  } catch (error) {
    console.error("Lock date error:", error);

    return res.status(500).json({
      success: false,
      message: "Date lock failed",
    });
  }
};

/* =========================
   GET LOCKED DATES
========================= */

export const getLockedDates = async (
  req: Request,
  res: Response
) => {
  try {
    const { productId } = req.query;

    let whereClause: any = {
      locked: true,
    };

    /* -------------------------
       FILTER PRODUCT
    -------------------------- */

    if (
      productId &&
      productId !== "ALL"
    ) {
      whereClause.productId =
        productId as string;
    }

    const locks = await prisma.slotLock.findMany({
      where: whereClause,
      select: {
        date: true,
      },
      orderBy: {
        date: "asc",
      },
    });

    const uniqueDates = [
      ...new Set(
        locks.map((lock) =>
          lock.date.toISOString().split("T")[0]
        )
      ),
    ];

    return res.json({
      success: true,
      totalDates: uniqueDates.length,
      dates: uniqueDates,
    });
  } catch (error) {
    console.error(
      "Get locked dates error:",
      error
    );

    return res.status(500).json({
      success: false,
      message: "Failed to load locked dates",
    });
  }
};

/* =========================
   UNLOCK DATE
========================= */

export const unlockDateByAdmin = async (
  req: Request,
  res: Response
) => {
  try {
    const { productId, date } = req.body;

    if (!date) {
      return res.status(400).json({
        success: false,
        message: "Date is required",
      });
    }

    const startDate = new Date(date);
    startDate.setHours(0, 0, 0, 0);

    const endDate = new Date(date);
    endDate.setHours(23, 59, 59, 999);

    const whereClause: any = {
      date: {
        gte: startDate,
        lte: endDate,
      },
    };

    if (
      productId &&
      productId !== "ALL"
    ) {
      whereClause.productId =
        productId;
    }

    const result =
      await prisma.slotLock.deleteMany({
        where: whereClause,
      });

    return res.json({
      success: true,
      message:
        productId === "ALL"
          ? "Date unlocked for all products"
          : "Date unlocked successfully",
      deletedLocks: result.count,
    });
  } catch (error) {
    console.error(
      "Unlock date error:",
      error
    );

    return res.status(500).json({
      success: false,
      message: "Date unlock failed",
    });
  }
};