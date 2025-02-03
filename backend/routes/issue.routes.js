import {Router} from "express";
import {cancelRequest, getIssuesByUser, requestBook , getRequestedBooks, getBorrowedBooks , getReturnedBooks , acceptRequestedBook, returnBook} from "../controllers/issue.controller.js"
import { authenticateAdmin, authenticateUser } from "../middlewares/authenticate.middleware.js";

const router = Router();

router.get('/get/:userId',getIssuesByUser)
router.post("/request" ,authenticateUser, requestBook);
router.post("/cancel-request" , cancelRequest);
router.get("/requested-books" ,getRequestedBooks)
router.get("/borrowed-books" ,getBorrowedBooks)
router.get("/history"  ,getReturnedBooks)
router.get("/accept/:issueId/:expectedReturnDate" , authenticateAdmin,acceptRequestedBook)
router.get('/return/:issueId' , returnBook)

export default router;