"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAvailability = void 0;
const prisma_1 = __importDefault(require("../lib/prisma"));
const getAvailability = async (req, res) => {
    try {
        const { productId, date } = req.query;
        const selectedDate = new Date(date);
        const slots = await prisma_1.default.slot.findMany({
            where: { productId: productId }
        });
        const booked = await prisma_1.default.bookingSlot.findMany({
            where: {
                booking: {
                    bookingDate: selectedDate,
                    paymentStatus: {
                        in: ["locked", "paid"]
                    }
                }
            },
            include: {
                slot: true
            }
        });
        const bookedSlotIds = booked.map((b) => b.slotId);
        res.json({
            slots,
            bookedSlots: bookedSlotIds
        });
    }
    catch (error) {
        res.status(500).json({ message: "Error fetching availability" });
    }
};
exports.getAvailability = getAvailability;
