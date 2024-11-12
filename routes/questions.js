import { Router } from "express";
import { authRequire } from "../middlewares/validateToken.js";
import questionsController from "../controllers/questions.js";

export const questionRouter = Router();

questionRouter.post('/createQuestion', authRequire, questionsController.createQuestion);
questionRouter.get('/getAllQuestions', questionsController.getAllQuestions);
questionRouter.get('/getQuestion/:id', questionsController.getQuestionById);
questionRouter.put('/updateQuestion/:id', authRequire, questionsController.updateQuestion);
questionRouter.delete('/deleteQuestion/:id', authRequire, questionsController.deleteQuestion);
questionRouter.put('/cambiarEstado/:id', authRequire, questionsController.changeState)

export default questionRouter;
