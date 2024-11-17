import { Router } from "express";
import { authRequire } from "../middlewares/validateToken.js";
import paymentController from "../controllers/payment.js";

export const paymentRouter = Router();

paymentRouter.get('/pay', authRequire, paymentController.payment);

export default paymentRouter;
