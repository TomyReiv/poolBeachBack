import { Router } from "express";
import SunbedController from "../controllers/sunbed.controller";

const router = Router();
const { getSunbeds, getSunbed, createSunbed, updateSunbed, deleteSunbed } = new SunbedController();

router.get("/", getSunbeds);
router.get("/:id", getSunbed);
router.post("/", createSunbed);
router.put("/:id", updateSunbed);
router.delete("/:id", deleteSunbed);

export default router;