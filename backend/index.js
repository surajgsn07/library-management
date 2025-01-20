import express from "express";
import cors from "cors";
import connectDb from "./db/index.js"
import cron from "node-cron";
import { notifyOnReturnDateNextDay } from "./utils/Notification.js";

const app = express();
const PORT = 3000;

connectDb();
app.use(cors({
    origin:"https://pcte-library.netlify.app",
    // origin:"http://localhost:5173",
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE"]
}));
app.use(express.json());

import studentRoutes from "./routes/student.routes.js";
import issueRoutes from "./routes/issue.routes.js"
import bookRoutes from "./routes/book.routes.js"
import adminRoutes from "./routes/admin.routes.js"
import bookSuggestionRoutes from "./routes/bookSuggestion.routes.js"

app.use("/student", studentRoutes);
app.use("/issue", issueRoutes);
app.use("/book", bookRoutes);
app.use("/admin", adminRoutes);
app.use("/suggestion", bookSuggestionRoutes);

cron.schedule('0 0 * * *', notifyOnReturnDateNextDay); 


app.listen(PORT, () => {
    console.log("Example app listening on port 3000!");
});