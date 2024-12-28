import { Router } from "express";
import multer from "multer";
import EventController from "../controllers/event.controller";

const router = Router();

const upload = multer({ dest: "uploads/" });

const eventController = new EventController();

const { getEvents, getEvent, createEvent, updateEvent, deleteEvent } = eventController;

router.get("/", getEvents);
router.get("/:id", getEvent);
router.post("/", upload.single("image"), createEvent);
router.put("/:id", updateEvent);
router.delete("/:id", deleteEvent);

export default router;
