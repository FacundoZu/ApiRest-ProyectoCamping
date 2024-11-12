import { Router } from "express"
import { authRequire } from "../middlewares/validateToken.js"
import ReservationController from "../controllers/reservation.js"

export const reservationRouter = Router()

reservationRouter.post('/createReservation', authRequire, ReservationController.createReservation);
reservationRouter.get('/getReservations/:id', ReservationController.getReservations);
reservationRouter.get('/getReservationsUser/:usuarioId', ReservationController.getReservationsUser);