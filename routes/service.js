import { Router } from "express"
import { authRequire } from "../middlewares/validateToken.js"
import serviceController from "../controllers/service.js"


export const serviceRouter = Router()

serviceRouter.post('/createService', authRequire, serviceController.createService);