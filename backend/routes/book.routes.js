import {Router} from "express"
import {searchBooks , createBook , addBookQuantity , addPicture, getBooksByGenre} from "../controllers/book.controller.js"
import { upload } from "../middlewares/multer.js";

const router = Router();


router.get("/search",searchBooks);
router.post("/create",createBook);
router.post('/add-quantity' , addBookQuantity);
router.get("/genre/:genre" , getBooksByGenre);
router.post("/addPicture", upload, addPicture)


export default router;