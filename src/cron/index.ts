import cron from "node-cron";
import { checkAbandonedBookings } from "../services/abandonedBookingCron";

export const startCronJobs = () => {

  console.log("Cron Jobs Started");

  cron.schedule("*/5 * * * *", async () => {

    console.log("Checking abandoned bookings...");

    await checkAbandonedBookings();

  });

};