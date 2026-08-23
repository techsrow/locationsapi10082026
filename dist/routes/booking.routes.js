"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const booking_controller_1 = require("../controllers/booking.controller");
const router = express_1.default.Router();
/* CREATE BOOKING LOCK */
router.post("/lock", booking_controller_1.lockBooking);
/* CALENDAR BOOKINGS */
router.get("/calendar", booking_controller_1.getCalendarBookings);
/* ADMIN DATE LOCK */
router.post("/admin/lock-date", booking_controller_1.lockDateByAdmin);
router.post("/admin/unlock-date", booking_controller_1.unlockDateByAdmin);
router.get("/admin/locked-dates", booking_controller_1.getLockedDates);
/* GET LOCKED DATES */
router.get("/locked-dates", booking_controller_1.getLockedDates);
/* GET ALL BOOKINGS */
router.get("/", booking_controller_1.getAllBookings);
/* GET SINGLE BOOKING (KEEP LAST) */
router.get("/:bookingId", booking_controller_1.getBooking);
exports.default = router;
