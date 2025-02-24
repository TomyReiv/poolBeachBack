import { Router } from "express";
import SunbedController from "../controllers/sunbed.controller";
import { isAdmin } from "../middlewares/isAdmin.middleware";

const router = Router();
const { getSunbeds, getSunbed, createSunbed, updateSunbed, deleteSunbed } = new SunbedController();

router.get("/", getSunbeds);
router.get("/:id", getSunbed);
router.post("/", createSunbed);
router.put("/:id", updateSunbed);
router.delete("/:id", isAdmin, deleteSunbed);

export default router;