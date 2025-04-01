import { Router } from "express"
import UserControler from "../controllers/user.js"
import passport from 'passport';
import { authRequire } from "../middlewares/validateToken.js"
import { upload } from '../middlewares/upload.js'


export const userRouter = Router()

userRouter.post("/register", UserControler.register)
userRouter.post("/login", UserControler.login)
userRouter.get("/logout", UserControler.logout)
userRouter.get("/getAllUsers", authRequire, UserControler.getAllUsers)
userRouter.get("/profile", authRequire, UserControler.profile)
userRouter.get("/profile/:id", authRequire, UserControler.profileById)
userRouter.put("/cambiarRol/:id", authRequire, UserControler.changeRole)
userRouter.get("/completeProfile", authRequire, UserControler.completeProfile)
userRouter.post("/editUser", authRequire, UserControler.editUser)
userRouter.post("/uploadImage", [authRequire, upload.fields([{ name: 'image', maxCount: 1 }])], UserControler.uploadImage);
userRouter.post("/registerVisit", authRequire, UserControler.registerVisit)
userRouter.get("/registerVisit/:id", authRequire, UserControler.getUserVisit)

userRouter.get('/google', passport.authenticate('google', { scope: ['profile', 'email'] }));
userRouter.get('/google/callback', passport.authenticate('google', { failureRedirect: 'http://localhost:5173/login' }), UserControler.googleCallback);
