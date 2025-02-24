import { Router } from "express";
import bookingController from "../controllers/booking.controller";
import { isAdmin } from "../middlewares/isAdmin.middleware";

const router = Router();
const BookingController = new bookingController();

const { getBookings, getBooking, createBooking, updateBooking, deleteBooking, cancelBooking } = BookingController;

router.get("/", getBookings);
router.get("/:id", getBooking);
router.post("/", createBooking);
router.put("/:id", updateBooking);
router.delete("/:id", isAdmin, deleteBooking);
router.get("/cancel", cancelBooking);

export default router;