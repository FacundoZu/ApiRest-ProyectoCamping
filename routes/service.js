import { Router } from "express";
import { authRequire } from "../middlewares/validateToken.js";
import serviceController from "../controllers/service.js";

export const serviceRouter = Router();

serviceRouter.post('/createService', authRequire, serviceController.createService);
serviceRouter.get('/getAllServices', serviceController.getAllServices);
serviceRouter.get('/getService/:id', serviceController.getServiceById);
serviceRouter.put('/updateService/:id', authRequire, serviceController.updateService);
serviceRouter.delete('/deleteService/:id', authRequire, serviceController.deleteService);
serviceRouter.put('/cambiarEstado/:id', authRequire, serviceController.changeState)

export default serviceRouter;
