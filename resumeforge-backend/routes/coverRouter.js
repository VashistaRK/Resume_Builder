import express from "express";
import multer from "multer";
import { createCoverLetter, deleteLetter, getAllCoverItems, getFile } from "../controllers/coverController.js";

const CoverRouter = express.Router();

// Use multer memory storage
const storage = multer.memoryStorage();
const upload = multer({ storage });

// POST route to create a new DocItem with image + document files
CoverRouter.post(
  "/",
  upload.fields([{ name: "image" }, { name: "document" }]),
  createCoverLetter
);

// GET all document items (metadata only)
CoverRouter.get("/", getAllCoverItems);

// GET specific file (image or document)
CoverRouter.get("/:id/:fileType", getFile);
// DLETE a Letter
CoverRouter.delete("/", deleteLetter);

export default CoverRouter;
