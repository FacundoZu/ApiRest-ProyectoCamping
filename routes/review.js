import { Router } from "express";
import { authRequire } from "../middlewares/validateToken.js";
import reviewController from "../controllers/review.js";

const reviewRouter = Router();

reviewRouter.post('/createReview', authRequire, reviewController.createReview);
reviewRouter.get('/getAllReviews', reviewController.getAllReviews);
reviewRouter.get('/getReviewsByCabin/:id', reviewController.getReviewsByCabin);
reviewRouter.post('/updateReview/:id', authRequire, reviewController.updateReview);
reviewRouter.delete('/deleteReview/:id', authRequire, reviewController.deleteReview);
reviewRouter.put('/cambiarEstado/:id', authRequire, reviewController.changeState)

export default reviewRouter;
