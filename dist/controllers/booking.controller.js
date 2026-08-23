"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getLockedDates = exports.unlockDateByAdmin = exports.lockDateByAdmin = exports.getCalendarBookings = exports.getBooking = exports.getAllBookings = exports.lockBooking = void 0;
const prisma_1 = __importDefault(require("../lib/prisma"));
/* =========================
   LOCK BOOKING (CUSTOMER)
========================= */
const lockBooking = async (req, res) => {
    try {
        const { productId, date, slotIds, firstName, lastName, email, phone, address, city, state, postcode } = req.body;
        if (!productId || !date || !slotIds || !Array.isArray(slotIds)) {
            return res.status(400).json({
                message: "Invalid booking request"
            });
        }
        const bookingDate = new Date(date);
        /* =========================
           CHECK ADMIN SLOT LOCK
        ========================= */
        const lockedSlot = await prisma_1.default.slotLock.findFirst({
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
        const lastBooking = await prisma_1.default.booking.findFirst({
            where: {
                bookingNumber: {
                    not: null,
                },
            },
            orderBy: {
                bookingNumber: "desc",
            },
            select: {
                bookingNumber: true,
            },
        });
        const nextBookingNumber = (lastBooking?.bookingNumber || 0) + 1;
        const bookingId = `LH-${String(nextBookingNumber).padStart(4, "0")}`;
        /* =========================
           CREATE BOOKING
        ========================= */
        const lockExpires = new Date(Date.now() + 10 * 60 * 1000);
        const booking = await prisma_1.default.booking.create({
            data: {
                bookingNumber: nextBookingNumber,
                bookingId,
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
                    create: slotIds.map((slotId) => ({
                        slotId,
                    })),
                },
            },
        });
        return res.json({
            success: true,
            bookingId: booking.bookingId
        });
    }
    catch (error) {
        console.error("Lock booking error:", error);
        return res.status(500).json({
            message: "Booking lock failed"
        });
    }
};
exports.lockBooking = lockBooking;
/* =========================
   GET ALL BOOKINGS
========================= */
const getAllBookings = async (req, res) => {
    try {
        const bookings = await prisma_1.default.booking.findMany({
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
    }
    catch (error) {
        console.error("Fetch bookings error:", error);
        res.status(500).json({
            message: "Error fetching bookings"
        });
    }
};
exports.getAllBookings = getAllBookings;
/* =========================
   GET BOOKING DETAILS
========================= */
const getBooking = async (req, res) => {
    try {
        const { bookingId } = req.params;
        const booking = await prisma_1.default.booking.findUnique({
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
    }
    catch (error) {
        console.error("Booking details error:", error);
        res.status(500).json({
            message: "Error fetching booking"
        });
    }
};
exports.getBooking = getBooking;
/* =========================
   CALENDAR BOOKINGS
========================= */
const getCalendarBookings = async (req, res) => {
    try {
        const bookings = await prisma_1.default.booking.findMany({
            include: {
                product: true,
                slots: {
                    include: { slot: true }
                }
            }
        });
        const events = bookings.flatMap((booking) => booking.slots.map((s) => {
            const date = new Date(booking.bookingDate);
            const start = new Date(date);
            const end = new Date(date);
            const [sh, sm] = s.slot.startTime.split(":");
            const [eh, em] = s.slot.endTime.split(":");
            start.setHours(Number(sh), Number(sm), 0, 0);
            end.setHours(Number(eh), Number(em), 0, 0);
            const customerName = `${booking.firstName ?? ""} ${booking.lastName ?? ""}`.trim() || "Customer";
            return {
                title: `${booking.product.name} - ${customerName}`,
                start,
                end,
                bookingId: booking.bookingId
            };
        }));
        res.json(events);
    }
    catch (error) {
        console.error("Calendar booking error:", error);
        res.status(500).json({
            message: "Error loading calendar bookings"
        });
    }
};
exports.getCalendarBookings = getCalendarBookings;
const lockDateByAdmin = async (req, res) => {
    try {
        const { date, reason } = req.body;
        if (!date) {
            return res.status(400).json({
                success: false,
                message: "Date is required",
            });
        }
        const normalizedDate = new Date(date);
        normalizedDate.setHours(0, 0, 0, 0);
        const existing = await prisma_1.default.dateLock.findUnique({
            where: {
                date: normalizedDate,
            },
        });
        if (existing) {
            return res.status(400).json({
                success: false,
                message: "Date already locked",
            });
        }
        const lock = await prisma_1.default.dateLock.create({
            data: {
                date: normalizedDate,
                reason,
            },
        });
        res.json({
            success: true,
            lock,
        });
    }
    catch (error) {
        res.status(500).json({
            success: false,
            message: "Failed to lock date",
        });
    }
};
exports.lockDateByAdmin = lockDateByAdmin;
const unlockDateByAdmin = async (req, res) => {
    try {
        const { date } = req.body;
        const normalizedDate = new Date(date);
        normalizedDate.setHours(0, 0, 0, 0);
        await prisma_1.default.dateLock.deleteMany({
            where: {
                date: normalizedDate,
            },
        });
        res.json({
            success: true,
        });
    }
    catch (error) {
        res.status(500).json({
            success: false,
            message: "Failed to unlock date",
        });
    }
};
exports.unlockDateByAdmin = unlockDateByAdmin;
const getLockedDates = async (req, res) => {
    try {
        const dates = await prisma_1.default.dateLock.findMany({
            orderBy: {
                date: "asc",
            },
        });
        res.json({
            success: true,
            dates,
        });
    }
    catch (error) {
        res.status(500).json({
            success: false,
            message: "Failed to fetch locked dates",
        });
    }
};
exports.getLockedDates = getLockedDates;
