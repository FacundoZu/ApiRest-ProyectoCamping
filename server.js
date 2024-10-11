import { conexion } from "./config/bd.js";
import express, { json, urlencoded } from "express";
import { corsMiddleware } from './middlewares/cors.js'
import cookieParser from 'cookie-parser'
import { userRouter } from "./routes/user.js"
import { cabinRouter } from "./routes/cabin.js";

import passport  from "passport";
import dotenv from 'dotenv'
import session from 'express-session'

// Inicializar app
console.log("App de node arrancada");
dotenv.config();
const app = express();
conexion();

// Middlewares
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

// Passport config
import './config/passport.js';  // Archivo donde configurarás Passport
app.use(passport.initialize());
app.use(passport.session());

// Cargo las rutas
app.use("/api/user", userRouter);
app.use("/api/cabin", cabinRouter);

// Poner servidor a escuchar peticiones http
const PORT = process.env.PORT ?? 3900;
app.listen(PORT, () => {
    console.log("servidor de node corriendo en el puerto: " + PORT)
})