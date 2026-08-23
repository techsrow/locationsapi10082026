"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.verifyPayment = exports.createOrder = void 0;
const razorpay_1 = __importDefault(require("razorpay"));
const prisma_1 = __importDefault(require("../lib/prisma"));
const crypto_1 = __importDefault(require("crypto"));
const email_service_1 = __importDefault(require("../services/email.service"));
const customerBookingEmail_1 = require("../emails/customerBookingEmail");
const adminBookingEmail_1 = require("../emails/adminBookingEmail");
const razorpay = new razorpay_1.default({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET
});
/* ------------------------------------------------
   CREATE RAZORPAY ORDER
------------------------------------------------ */
const createOrder = async (req, res) => {
    try {
        const { bookingId } = req.body;
        const booking = await prisma_1.default.booking.findUnique({
            where: { bookingId },
            include: {
                product: true,
                slots: {
                    include: { slot: true }
                }
            }
        });
        if (!booking) {
            return res.status(404).json({
                message: "Booking not found"
            });
        }
        /* -------------------------------
           DYNAMIC PAYMENT CALCULATION
        -------------------------------- */
        const bookingAmount = Number(booking.product.bookingAmount);
        const gstAmount = +(bookingAmount * 0.18).toFixed(2);
        const totalPay = +(bookingAmount + gstAmount).toFixed(2);
        const razorAmount = Math.round(totalPay * 100);
        /* -------------------------------
           CREATE RAZORPAY ORDER
        -------------------------------- */
        const order = await razorpay.orders.create({
            amount: razorAmount,
            currency: "INR",
            receipt: booking.bookingId
        });
        /* -------------------------------
           UPDATE BOOKING
        -------------------------------- */
        await prisma_1.default.booking.update({
            where: { id: booking.id },
            data: {
                bookingAmount,
                gstAmount,
                totalAmount: totalPay,
                razorpayOrderId: order.id
            }
        });
        res.json(order);
    }
    catch (error) {
        console.error("Create order error:", error);
        res.status(500).json({
            message: "Order creation failed"
        });
    }
};
exports.createOrder = createOrder;
/* ------------------------------------------------
   VERIFY PAYMENT
------------------------------------------------ */
const verifyPayment = async (req, res) => {
    try {
        const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;
        const body = razorpay_order_id + "|" + razorpay_payment_id;
        const expectedSignature = crypto_1.default
            .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
            .update(body)
            .digest("hex");
        if (expectedSignature !== razorpay_signature) {
            return res.status(400).json({
                message: "Invalid signature"
            });
        }
        const booking = await prisma_1.default.booking.findFirst({
            where: { razorpayOrderId: razorpay_order_id },
            include: {
                product: true,
                slots: {
                    include: { slot: true }
                }
            }
        });
        if (!booking) {
            return res.status(404).json({
                message: "Booking not found"
            });
        }
        await prisma_1.default.booking.update({
            where: { id: booking.id },
            data: {
                razorpayPaymentId: razorpay_payment_id,
                paymentStatus: "paid"
            }
        });
        /* ------------------------------------------------
           PREPARE EMAIL DATA
        ------------------------------------------------ */
        const slotText = booking.slots
            .map((s) => s.slot.label)
            .join(", ");
        const bookingDate = new Date(booking.bookingDate).toLocaleDateString();
        /* ------------------------------------------------
           SEND CUSTOMER EMAIL
        ------------------------------------------------ */
        try {
            if (booking.email) {
                await email_service_1.default.sendMail({
                    from: process.env.EMAIL_USER,
                    to: booking.email,
                    subject: `Booking Confirmed - ${booking.bookingId}`,
                    html: (0, customerBookingEmail_1.customerBookingEmail)({
                        bookingId: booking.bookingId,
                        firstName: booking.firstName || "Customer",
                        product: booking.product.name,
                        date: bookingDate,
                        slots: slotText
                    })
                });
            }
        }
        catch (err) {
            console.error("Customer email failed:", err);
        }
        /* ------------------------------------------------
           SEND ADMIN EMAIL
        ------------------------------------------------ */
        try {
            await email_service_1.default.sendMail({
                from: process.env.EMAIL_USER,
                to: process.env.ADMIN_EMAIL || process.env.EMAIL_USER,
                subject: `New Booking ${booking.bookingId}`,
                html: (0, adminBookingEmail_1.adminBookingEmail)({
                    bookingId: booking.bookingId,
                    name: `${booking.firstName || ""} ${booking.lastName || ""}`.trim(),
                    email: booking.email || "Not Provided",
                    date: bookingDate,
                    package: booking.product.name,
                    slots: slotText,
                    cost: booking.product.price,
                    total: booking.totalAmount,
                    advance: booking.bookingAmount,
                    due: Number(booking.product.price) -
                        Number(booking.bookingAmount),
                    paymentMethod: "Razorpay",
                    address: booking.address || "-",
                    city: booking.city || "-",
                    postcode: booking.postcode || "-",
                    state: booking.state || "-",
                    phone: booking.phone || "-"
                })
            });
        }
        catch (err) {
            console.error("Admin email failed:", err);
        }
        res.json({
            success: true
        });
    }
    catch (error) {
        console.log("Verify Payment Request:", req.body);
        console.error("Payment verification error:", error);
        res.status(500).json({
            message: "Verification failed"
        });
    }
};
exports.verifyPayment = verifyPayment;
