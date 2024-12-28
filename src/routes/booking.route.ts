import { Router } from "express";
import bookingController from "../controllers/booking.controller";

const router = Router();
const BookingController = new bookingController();

const { getBookings, getBooking, createBooking, updateBooking, deleteBooking } = BookingController;

router.get("/", getBookings);
router.get("/:id", getBooking);
router.post("/", createBooking);
router.put("/:id", updateBooking);
router.delete("/:id", deleteBooking);

export default router;