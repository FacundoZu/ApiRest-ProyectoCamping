import { Router } from "express";
import { authRequire } from "../middlewares/validateToken.js";
import activityController from "../controllers/activity.js";

export const activityRouter = Router();

activityRouter.post('/createActivity', authRequire, activityController.createActivity);
activityRouter.get('/getAllActivities', activityController.getAllActivities);
activityRouter.get('/getActivity/:id', activityController.getActivityById);
activityRouter.put('/updateActivity/:id', authRequire, activityController.updateActivity);
activityRouter.delete('/deleteActivity/:id', authRequire, activityController.deleteActivity);

export default activityRouter;
