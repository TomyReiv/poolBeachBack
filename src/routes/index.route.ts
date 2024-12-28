import { Router } from "express";
import UserRoute from "./user.route";
import EventRoute from "./event.route";
import BookingRoute from "./booking.route";
import SundbedRoute from "./sundbed.route";

const router = Router();

router.use("/api/user", UserRoute)
router.use("/api/event", EventRoute)
router.use("/api/booking", BookingRoute)
router.use("/api/sundbed", SundbedRoute)

export default router;