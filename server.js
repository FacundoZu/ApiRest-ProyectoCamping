import { conexion } from "./config/bd.js";
import express, { json, urlencoded } from "express";
import { corsMiddleware } from './middlewares/cors.js'
import cookieParser from 'cookie-parser'
import { userRouter } from "./routes/user.js"
import { cabinRouter } from "./routes/cabin.js";
import { reservationRouter } from "./routes/reservation.js";
import { serviceRouter } from "./routes/service.js";
import { activityRouter } from "./routes/activity.js";
import { questionRouter } from "./routes/questions.js";

import './config/passport.js'; 
import passport  from "passport";
import dotenv from 'dotenv'
import session from 'express-session'

console.log("App de node arrancada");
dotenv.config();
const app = express();
conexion();

app.use(corsMiddleware());
app.use(json());
app.use(urlencoded({ extended: true }));

app.use(cookieParser());
app.use(session({
  secret: process.env.JWT_SECRET,
  resave: false,
  saveUninitialized: true,
  cookie: { secure: process.env.NODE_ENV === 'production' }
}));

app.use(passport.initialize());
app.use(passport.session());


app.use("/api/user", userRouter);
app.use("/api/cabin", cabinRouter);
app.use("/api/reservation", reservationRouter)
app.use("/api/service", serviceRouter)
app.use("/api/activity", activityRouter)
app.use("/api/question", questionRouter)

const PORT = process.env.PORT ?? 3900;
app.listen(PORT, () => {
    console.log("servidor de node corriendo en el puerto: " + PORT)
})