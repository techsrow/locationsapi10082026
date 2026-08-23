"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.markBookingPaidByWebhook = exports.createPaymentOrder = exports.updateCustomerDetails = exports.getBookingSummary = exports.lockBooking = void 0;
const prisma_1 = __importDefault(require("../lib/prisma"));
const razorpay_1 = __importDefault(require("../utils/razorpay"));
/* =========================
   LOCK BOOKING (FREEZE DATA)
========================= */
const lockBooking = async (data) => {
    const { productId, bookingDate, slotIds } = data;
    // Normalize date (remove time)
    const normalizedDate = new Date(bookingDate);
    normalizedDate.setHours(0, 0, 0, 0);
    return await prisma_1.default.$transaction(async (tx) => {
        /* =========================
           1️⃣ Validate Product
        ========================= */
        const product = await tx.product.findUnique({
            where: { id: productId },
        });
        if (!product) {
            throw new Error("Product not found");
        }
        /* =========================
           2️⃣ Check Admin Locked Date
        ========================= */
        const lockedDate = await tx.dateLock.findFirst({
            where: {
                date: normalizedDate,
            },
        });
        if (lockedDate) {
            throw new Error(lockedDate.reason ||
                "This date has been blocked by admin");
        }
        /* =========================
           3️⃣ Validate Slots
        ========================= */
        const slots = await tx.slot.findMany({
            where: {
                id: { in: slotIds },
                productId,
            },
        });
        if (slots.length !== slotIds.length) {
            throw new Error("Invalid slot selection");
        }
        /* =========================
           4️⃣ Check Slot Availability
        ========================= */
        for (const slotId of slotIds) {
            const existing = await tx.booking.findFirst({
                where: {
                    productId,
                    bookingDate: normalizedDate,
                    OR: [
                        {
                            paymentStatus: "paid",
                        },
                        {
                            paymentStatus: "locked",
                            lockExpiresAt: {
                                gt: new Date(),
                            },
                        },
                    ],
                    slots: {
                        some: {
                            slotId,
                        },
                    },
                },
            });
            if (existing) {
                throw new Error("One of the selected slots is already booked");
            }
        }
        /* =========================
           5️⃣ Pricing Calculation
        ========================= */
        const baseAmount = Number(product.price) * slotIds.length;
        const gstAmount = Number((baseAmount * 0.18).toFixed(2));
        const totalAmount = Number((baseAmount + gstAmount).toFixed(2));
        const bookingAmount = Number((totalAmount * 0.5).toFixed(2));
        // const bookingId = `LH-${Date.now()}`;
        /* =========================
       Generate Booking Number
    ========================= */
        const lastBooking = await tx.booking.findFirst({
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
        const lockExpiresAt = new Date(Date.now() + 10 * 60 * 1000);
        /* =========================
           6️⃣ Create Booking
        ========================= */
        const booking = await tx.booking.create({
            data: {
                bookingNumber: nextBookingNumber,
                bookingId,
                productId,
                bookingDate: normalizedDate,
                totalAmount,
                gstAmount,
                bookingAmount,
                paymentStatus: "locked",
                lockExpiresAt,
                slots: {
                    create: slotIds.map((slotId) => ({
                        slotId,
                    })),
                },
            },
        });
        return booking;
    });
};
exports.lockBooking = lockBooking;
const getBookingSummary = async (bookingId) => {
    const booking = await prisma_1.default.booking.findUnique({
        where: { bookingId },
        include: {
            product: true,
            slots: {
                include: {
                    slot: true,
                },
            },
        },
    });
    if (!booking)
        throw new Error("Booking not found");
    const remaining = Number(booking.totalAmount ?? 0) - Number(booking.bookingAmount ?? 0);
    return {
        bookingId: booking.bookingId,
        productName: booking.product.name,
        bookingDate: booking.bookingDate,
        paymentStatus: booking.paymentStatus,
        paymentId: booking.razorpayPaymentId,
        customerName: `${booking.firstName ?? ""} ${booking.lastName ?? ""}`,
        email: booking.email,
        slots: booking.slots.map((s) => ({
            label: s.slot.label,
            startTime: s.slot.startTime,
            endTime: s.slot.endTime,
        })),
        totalAmount: booking.totalAmount,
        gstAmount: booking.gstAmount,
        bookingAmount: booking.bookingAmount,
        remainingAmount: remaining,
    };
};
exports.getBookingSummary = getBookingSummary;
const updateCustomerDetails = async (bookingId, data) => {
    const booking = await prisma_1.default.booking.findUnique({
        where: { bookingId },
    });
    if (!booking) {
        throw new Error("Booking not found");
    }
    if (booking.paymentStatus !== "locked") {
        throw new Error("Cannot update paid booking");
    }
    return await prisma_1.default.booking.update({
        where: { bookingId },
        data,
    });
};
exports.updateCustomerDetails = updateCustomerDetails;
const createPaymentOrder = async (bookingId) => {
    const booking = await prisma_1.default.booking.findUnique({
        where: { bookingId },
    });
    if (!booking)
        throw new Error("Booking not found");
    if (booking.paymentStatus !== "locked") {
        throw new Error("Booking not available for payment");
    }
    if (booking.razorpayOrderId) {
        throw new Error("Payment already initiated");
    }
    const razorOrder = await razorpay_1.default.orders.create({
        amount: Math.round(Number(booking.bookingAmount ?? 0) * 100),
        currency: "INR",
        receipt: bookingId,
    });
    await prisma_1.default.booking.update({
        where: { bookingId },
        data: {
            razorpayOrderId: razorOrder.id,
        },
    });
    return razorOrder;
};
exports.createPaymentOrder = createPaymentOrder;
const markBookingPaidByWebhook = async (razorpayOrderId, razorpayPaymentId) => {
    const booking = await prisma_1.default.booking.findUnique({
        where: { razorpayOrderId },
    });
    if (!booking)
        throw new Error("Booking not found");
    if (booking.paymentStatus === "paid")
        return booking;
    const updated = await prisma_1.default.booking.update({
        where: { razorpayOrderId },
        data: {
            paymentStatus: "paid",
            razorpayPaymentId,
            lockExpiresAt: null,
        },
    });
    // TODO: send email here
    // await sendBookingEmails(updated);
    return updated;
};
exports.markBookingPaidByWebhook = markBookingPaidByWebhook;
