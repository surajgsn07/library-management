import {Router} from "express";
import {cancelRequest, getIssuesByUser, requestBook , getRequestedBooks, getBorrowedBooks , getReturnedBooks , acceptRequestedBook} from "../controllers/issue.controller.js"
import { authenticateUser } from "../middlewares/authenticate.middleware.js";

const router = Router();

router.get('/get/:userId',getIssuesByUser)
router.post("/request" ,authenticateUser, requestBook);
router.post("/cancel-request" , cancelRequest);
router.get("/requested-books" ,getRequestedBooks)
router.get("/borrowed-books" ,getBorrowedBooks)
router.get("/history"  ,getReturnedBooks)
router.get("/accept/:issueId" , acceptRequestedBook)

export default router;