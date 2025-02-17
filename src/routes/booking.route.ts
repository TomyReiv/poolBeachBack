import { Router } from "express";
import bookingController from "../controllers/booking.controller";

const router = Router();
const BookingController = new bookingController();

const { getBookings, getBooking, createBooking, updateBooking, deleteBooking, cancelBooking } = BookingController;

router.get("/", getBookings);
router.get("/booking/:id", getBooking);
router.post("/", createBooking);
router.put("/:id", updateBooking);
router.delete("/:id", deleteBooking);
router.get("/cancel", cancelBooking)

export default router;