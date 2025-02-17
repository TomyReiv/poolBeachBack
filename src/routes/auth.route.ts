import { Router } from "express";
import passport from "passport";
import { checkAuth, handleGoogleCallback } from "../controllers/auth.controller";

const router = Router();

// Inicia la autenticación con Google
router.get("/google", passport.authenticate("google", { scope: ["profile", "email"] }));

// Maneja el callback de Google
router.get(
  "/google/callback",
  passport.authenticate("google", { session: false }),
  handleGoogleCallback,
);
router.get("/check-auth", checkAuth);
export default router;
