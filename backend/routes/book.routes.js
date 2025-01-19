import {Router} from "express"
import {searchBooks , createBook , addBookQuantity , addPicture} from "../controllers/book.controller.js"
import { upload } from "../middlewares/multer.js";

const router = Router();


router.get("/search",searchBooks);
router.post("/create",createBook);
router.post('/add-quantity' , addBookQuantity);
router.post("/addPicture", upload.single('image') , addPicture)


export default router;