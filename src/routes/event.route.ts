import { Router } from "express";
import EventController from "../controllers/event.controller";
import multer from "multer";
import { isAdmin } from "../middlewares/isAdmin.middleware";

const upload = multer({ dest: "uploads/" });

const router = Router();


const eventController = new EventController();

const { getEvents, getEvent, createEvent, updateEvent, deleteEvent } = eventController;

router.get("/", getEvents);
router.get("/:id", getEvent);
router.post("/", isAdmin, upload.single("image"), createEvent);
router.put("/:id", updateEvent);
router.delete("/:id", isAdmin, deleteEvent);

export default router;
