// Si usas TypeScript:
import mongoose from "mongoose";
import { db } from "./utils/constant";
import { errorHandler } from "./middlewares/errorHandler";
import express from "express";
import IndexRoute from "./routes/index.route";
import cors from "cors"

import session from "express-session";
import passport from "passport";
import "./config/passport.config";

import path from "path";

import WebRoute from "./routes/webhook.route";

const app = express();

app.use(
  session({
    secret: "secreto",
    resave: false,
    saveUninitialized: true,
  })
);
// Inicialización de Passport
app.use(passport.initialize());
app.use(passport.session());

app.use(express.static(path.join(__dirname, "public")));

app.use("/api/webhook", express.raw({ type: "application/json" }), WebRoute);

app.use(errorHandler);
app.use(cors())
app.use(express.json());
app.use(express.urlencoded({extended: true}))

app.use("/", IndexRoute);

app.get("/booking-test", (req, res) => {
  res.sendFile(path.join(__dirname, "../public/booking.html"));
});

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