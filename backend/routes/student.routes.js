import {Router} from 'express';
import {registerUser , loginUser, getUser, searchUser, deleteUser, updateUser} from "../controllers/user.controller.js"
import { authenticateUser } from '../middlewares/authenticate.middleware.js';

const router = Router();
router.post('/register',registerUser);
router.post('/login',loginUser);
router.get("/user" ,authenticateUser ,getUser )
router.get('/search', searchUser);
router.delete('/:studentid' , deleteUser  )
router.post('/update/:studentid' , updateUser)


export default router;