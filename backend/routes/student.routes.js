import {Router} from 'express';
import {registerUser , loginUser, getUser} from "../controllers/user.controller.js"
import { authenticateUser } from '../middlewares/authenticate.middleware.js';

const router = Router();
router.post('/register',registerUser);
router.post('/login',loginUser);
router.get("/user" ,authenticateUser ,getUser )

export default router;