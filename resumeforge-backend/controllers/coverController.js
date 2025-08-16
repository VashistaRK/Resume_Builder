// server/controllers/coverLetterController.js
import CoverItem from "../models/coverLetters.js";
import client from "../services/redisClient.js";  // ✅ Redis client

// CREATE NEW COVER LETTER
export const createCoverLetter = async (req, res) => {
  try {
    const imageFile = req.files["image"]?.[0];
    const documentFile = req.files["document"]?.[0];

    if (!imageFile || !documentFile) {
      return res.status(400).json({ message: "Both image and document files are required" });
    }

    const newItem = new CoverItem({
      name: req.body.name,
      purpose: req.body.purpose,
      image: {
        data: imageFile.buffer,
        contentType: imageFile.mimetype,
      },
      document: {
        data: documentFile.buffer,
        contentType: documentFile.mimetype,
      },
    });

    await newItem.save();

    // Invalidate Redis cache after new insert
    await client.del("coverItems");

    res.status(201).json({ message: "Document item created successfully", id: newItem._id });
  } catch (error) {
    console.error("Error creating document item:", error);
    res.status(500).json({ message: "Failed to create document item", error: error.message });
  }
};


// GET ALL COVER LETTERS (WITHOUT FILES) + REDIS CACHING
export const getAllCoverItems = async (req, res) => {
  try {
    const cached = await client.get("coverItems");
    if (cached) {
      return res.status(200).json(JSON.parse(cached));
    }

    const items = await CoverItem.find().select("-image -document");

    // Cache for 1 hour
    await client.set("coverItems", JSON.stringify(items), { EX: 3600 });

    res.status(200).json(items);
  } catch (error) {
    console.error("Error fetching document items:", error);
    res.status(500).json({ message: "Failed to fetch document items", error: error.message });
  }
};


// FETCH SINGLE FILE (image or document)
export const getFile = async (req, res) => {
  try {
    const item = await CoverItem.findById(req.params.id);
    if (!item) {
      return res.status(404).json({ message: "Document item not found" });
    }

    const fileType = req.params.fileType;
    if (fileType === "image") {
      res.contentType(item.image.contentType);
      res.send(item.image.data);
    } else if (fileType === "document") {
      res.contentType(item.document.contentType);
      res.send(item.document.data);
    } else {
      res.status(400).json({ message: "Invalid file type requested" });
    }
  } catch (error) {
    console.error("Error fetching file:", error);
    res.status(500).json({ message: "Failed to fetch file", error: error.message });
  }
};


// DELETE A LETTER BY ID (✅ FIXED)
export const deleteLetter = async (req, res) => {
  try {
    const id = req.params.id;
    const deleted = await CoverItem.findByIdAndDelete(id);
    if (!deleted) {
      return res.status(404).json({ message: "Item not found" });
    }

    // Invalidate cache
    await client.del("coverItems");

    res.status(200).json({ message: "Deleted successfully", deleted });
  } catch (error) {
    console.error("Error deleting item:", error);
    res.status(500).json({ message: "Failed to delete item", error: error.message });
  }
};
