// import fs from "fs";
// import https from "https";
import express from "express";
import cors from "cors";
import nodemailer from "nodemailer";
import { connectDB } from "./config/db.js";
import userRouter from "./routes/userRoutes.js";
import dotenv from "dotenv";
dotenv.config();

import { requireAuth } from "./middleware/clerkAuthMiddleware.js";
import path from "path";
import { fileURLToPath } from "url";
import resumeRouter from "./routes/resumeRoutes.js";
import router from "./routes/itemsRoutes.js";
import CoverRouter from "./routes/coverRouter.js";
import rateLimit from "express-rate-limit";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors({
  origin: [process.env.Frontend_PORT, "https://your-frontend-domain.com"], // adjust for frontend
  credentials: true
}));
app.use(express.json());


//for https
// const options = {
//   key: fs.readFileSync("./certs/server.key"),
//   cert: fs.readFileSync("./certs/server.cert"),
// };

// https.createServer(options, app).listen(5000, () => {
//   console.log("HTTPS server running on port 5000");
// });


connectDB();

// Rate Limiter
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100,
  message: "Too many requests, try again later.",
});
app.use("/api/", limiter);

app.use("/api/auth", userRouter);
app.use("/api/resume", resumeRouter);
app.use("/api/docitems", router);
app.use("/api/coverletters", CoverRouter);
app.use("/uploads", express.static("uploads"));

app.get("/", (req, res) => {
  res.send("API WORKING also on HTTPS");
});

// ✅ Contact form route
app.post("/api/contact/send-email", async (req, res) => {
  const { name, email, company, phone, message } = req.body;

  if (!name || !email || !message) {
    return res.status(400).json({ success: false, message: "Missing fields" });
  }

  // Nodemailer setup
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_USER, // Gmail address
      pass: process.env.EMAIL_PASS, // Gmail App Password
    },
  });

  const mailOptions = {
    from: email, // ✅ Use your Gmail as sender
    to: "your-email@example.com", // 👈 Replace with recipient email
    subject: `New Contact Form Submission from ${name}`,
    text: `
      Name: ${name}
      Company: ${company || "N/A"}
      Email: ${email}
      Phone: ${phone || "N/A"}
      Message: ${message}
    `,
  };

  try {
    await transporter.sendMail(mailOptions);
    res.json({ success: true, message: "Email sent successfully!" });
  } catch (err) {
    console.error("Error sending email:", err);
    res.status(500).json({ success: false, message: "Email sending failed" });
  }
});

app.listen(PORT, () => {
  console.log(`🚀 Server Started on port ${PORT}`);
});

