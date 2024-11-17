import { Router } from "express";
import { authRequire } from "../middlewares/validateToken.js";
import serviceController from "../controllers/service.js";
import { upload } from "../middlewares/upload.js";

export const serviceRouter = Router();

serviceRouter.get('/getAllServices', serviceController.getAllServices);
serviceRouter.get('/getService/:id', serviceController.getServiceById);
serviceRouter.put('/updateService/:id', authRequire, serviceController.updateService);
serviceRouter.delete('/deleteService/:id', authRequire, serviceController.deleteService);
serviceRouter.put('/cambiarEstado/:id', authRequire, serviceController.changeState);
serviceRouter.post('/createService', authRequire, serviceController.createService);
serviceRouter.post("/uploadServiceImage", [authRequire, upload.fields([{ name: 'image', maxCount: 1 }])], serviceController.uploadServiceImage);

export default serviceRouter;
