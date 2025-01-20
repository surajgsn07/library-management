import {Router} from "express"
import { bookAddedToLibrary, createBookSuggestion, getAllBookSuggestions } from "../controllers/bookSuggestion.controller.js";
import { authenticateUser } from "../middlewares/authenticate.middleware.js";
const router = Router();

router.post("/create" , authenticateUser,createBookSuggestion);
router.post("/add-to-library" ,bookAddedToLibrary );
router.get("/all" , getAllBookSuggestions);

export default router;