import mongoose from "mongoose";
import { db, URL_ORIGEN } from "./utils/constant";
import { errorHandler } from "./middlewares/errorHandler";
import express from "express";
import IndexRoute from "./routes/index.route";
import cors from "cors";
import cookieParser from "cookie-parser";
import session from "express-session";
import passport from "passport";
import "./config/passport.config";
import rateLimit from "express-rate-limit";
import helmet from "helmet"; // ✅ Importar Helmet
import path from "path";
import WebRoute from "./routes/webhook.route";

const app = express();

app.use(express.static(path.join(__dirname, "public")));

// 🔹 **CORS (Permitir solo solicitudes desde el frontend)**
const corsOptions = {
  origin: URL_ORIGEN, // Origen permitido
  credentials: true, // Permite el envío de credenciales
};
app.use(cors(corsOptions));

// 🔹 **Seguridad con Helmet**
app.use(helmet()); // ✅ Protege contra ataques XSS, Clickjacking, etc.

// 🔹 **Rate Limiter (Evita ataques de fuerza bruta)**
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: 100, // Máximo 100 requests por IP
  message: "Demasiadas peticiones desde esta IP, intenta más tarde.",
});


// 🔹 **Middleware para procesar JSON y URL-encoded**
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// 🔹 **Rutas protegidas (ejemplo de Webhook de Stripe)**
app.use("/api/webhook", express.raw({ type: "application/json" }), WebRoute);
// ✅ Aplica el limitador a todas las rutas
app.use(limiter);
// 🔹 **Sesiones y autenticación**
app.use(
  session({
    secret: "secreto",
    resave: false,
    saveUninitialized: true,
  })
);
app.use(cookieParser());
app.use(passport.initialize());
app.use(passport.session());

// 🔹 **Rutas de la API**
app.use("/", IndexRoute);

// 🔹 **Middleware de manejo de errores**
app.use(errorHandler);

// 🔹 **Conexión a MongoDB**
(async () => {
  try {
    await mongoose.connect(db, {
      maxPoolSize: 20,
      minPoolSize: 5,
    });
    console.log("database is connected");
  } catch (error) {
    console.log(error);
  }
})();

export default app;
