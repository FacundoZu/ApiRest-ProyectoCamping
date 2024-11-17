import { Router } from "express";
import { authRequire } from "../middlewares/validateToken.js";
import activityController from "../controllers/activity.js";
import { upload } from "../middlewares/upload.js";

export const activityRouter = Router();

activityRouter.post('/createActivity', authRequire, activityController.createActivity);
activityRouter.get('/getAllActivities', activityController.getAllActivities);
activityRouter.get('/getActivity/:id', activityController.getActivityById);
activityRouter.put('/updateActivity/:id', authRequire, activityController.updateActivity);
activityRouter.delete('/deleteActivity/:id', authRequire, activityController.deleteActivity);
activityRouter.put('/cambiarEstado/:id', authRequire, activityController.changeState);
activityRouter.post("/uploadActivityImage", [authRequire, upload.fields([{ name: 'image', maxCount: 1 }])], activityController.uploadActivityImage);

export default activityRouter;
