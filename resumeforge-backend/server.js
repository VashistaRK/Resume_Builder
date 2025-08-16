import express from "express"
import cors from "cors"
import { connectDB } from "./config/db.js";
import userRouter from "./routes/userRoutes.js";
import dotenv from "dotenv";
dotenv.config();

import { requireAuth } from './middleware/clerkAuthMiddleware.js';
import path from "path";
import { fileURLToPath } from "url";
import resumeRouter from "./routes/resumeRoutes.js";
import router from "./routes/itemsRoutes.js";
import CoverRouter from "./routes/coverRouter.js";
import rateLimit from 'express-rate-limit';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);


const app = express();
const PORT = process.env.PORT;

app.use(cors())
app.use(express.json())

connectDB();
// const rateLimit = require('express-rate-limit');

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // 100 requests per IP
  message: 'Too many requests, try again later.',
});

app.use('/api/', limiter);


app.use('/api/auth', userRouter)
app.use('/api/resume', resumeRouter)
app.use("/api/docitems", router);
app.use("/api/coverletters", CoverRouter);
app.use("/uploads", express.static("uploads"));
// app.use('/uploads',express.static(path.join(__dirname,'uploads'),{
//     setHeaders: (res, __path) => {
//         res.set("Access-Control-Allow-Origin", 'http://localhost:5173');
//     }
// }))

app.get('/',(req,res) => {
    res.send('API WORKING')
})

app.listen(PORT,()=>{console.log(`server Started :${PORT}`)})