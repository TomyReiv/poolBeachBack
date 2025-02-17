// Si usas TypeScript:
import mongoose from "mongoose";
import { db, URL_ORIGEN } from "./utils/constant";
import { errorHandler } from "./middlewares/errorHandler";
import express from "express";
import IndexRoute from "./routes/index.route";
import cors from "cors";
import cookieParser from 'cookie-parser';
import session from "express-session";
import passport from "passport";
import "./config/passport.config";

import path from "path";

import WebRoute from "./routes/webhook.route";

const app = express();

app.use(express.static(path.join(__dirname, "public")));

app.use("/api/webhook", express.raw({ type: "application/json" }), WebRoute);

/* app.use(
  cors({
    origin: "http://localhost:3000", // Origen permitido
    methods: ["GET", "POST", "PUT", "DELETE"], // Métodos permitidos
    credentials: true, // Permite cookies y encabezados de autenticación
    allowedHeaders: 'Content-Type, Authorization'
  })
); */
const corsOptions = {
  origin: URL_ORIGEN,  // Aquí especificas el origen permitido
  credentials: true,  // Permite el envío de credenciales (cookies, encabezados de autenticación, etc.)
};

app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(
  session({
    secret: "secreto",
    resave: false,
    saveUninitialized: true,
  })
);
app.use(cookieParser());
// Inicialización de Passport
app.use(passport.initialize());
app.use(passport.session());

app.use("/", IndexRoute);

/* app.get("/booking-test", (req, res) => {
  res.sendFile(path.join(__dirname, "../public/booking.html"));
});

app.get("/") */

app.use(errorHandler);

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
