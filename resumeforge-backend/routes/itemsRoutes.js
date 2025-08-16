import express from "express";
import multer from "multer";
import {
  createDocItem,
  deleteFile,
  getAllDocItems,
  getFile,
  updateDocItem,
} from "../controllers/itemsController.js";

const router = express.Router();

// Use multer memory storage
const storage = multer.memoryStorage();
const upload = multer({ storage });

// POST route to create a new DocItem with image + document files
router.post(
  "/",
  upload.fields([{ name: "image" }, { name: "document" }]),
  createDocItem
);

// GET all document items (metadata only)
router.get("/", getAllDocItems);

// GET specific file (image or document)
router.get("/:id/:fileType", getFile);
// DELETE specific items
router.delete("/:id", deleteFile);

router.put(
  "/:id",
  upload.fields([{ name: "image" }, { name: "document" }]),
  updateDocItem
);

export default router;
