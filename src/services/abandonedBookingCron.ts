import prisma from "../lib/prisma";

import nodemailer from "nodemailer";
import { abandonedBookingEmail } from "../emails/abandonedBookingEmail";
import transporter from "./email.service";

export const checkAbandonedBookings = async () => {
  try {

    const abandonedBookings = await prisma.booking.findMany({
      where: {
        paymentStatus: "locked",
        abandonedEmailSent: false,
        lockExpiresAt: {
          lt: new Date(),
        },
      },

      include: {
        product: true,
        slots: {
          include: {
            slot: true,
          },
        },
      },
    });

    if (!abandonedBookings.length) {
      return;
    }

    for (const booking of abandonedBookings) {

      await transporter.sendMail({
        from: process.env.EMAIL_USER,
        to: process.env.ADMIN_EMAIL,
        subject: `⚠ Abandoned Checkout - ${booking.bookingId}`,
        html: abandonedBookingEmail(booking),
      });

      await prisma.booking.update({
        where: {
          id: booking.id,
        },
        data: {
          abandonedEmailSent: true,
        },
      });

      console.log(
        `Abandoned booking email sent: ${booking.bookingId}`
      );
    }

  } catch (error) {
    console.error(
      "Abandoned booking cron error:",
      error
    );
  }
};