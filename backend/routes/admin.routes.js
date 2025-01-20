import {Router} from "express"
import { getAdmin, loginAdmin, registerAdmin } from "../controllers/admin.controller.js";
import { authenticateAdmin } from "../middlewares/authenticate.middleware.js";

const router = Router();

router.post("/register" , registerAdmin);
router.post("/login" , loginAdmin);
router.get("/user" , authenticateAdmin , getAdmin)

export default router;