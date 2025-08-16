import DocItem from "../models/items.js";
import client from "../services/redisClient.js";

const DOC_ITEMS_KEY = "doc_items";

export const createDocItem = async (req, res) => {
  try {
    const imageFile = req.files["image"]?.[0];
    const documentFile = req.files["document"]?.[0];

    if (!imageFile || !documentFile) {
      return res.status(400).json({ message: "Both image and document files are required" });
    }

    const newItem = new DocItem({
      name: req.body.name,
      description: req.body.description,
      category: req.body.category,
      image: {
        data: imageFile.buffer,
        contentType: imageFile.mimetype,
      },
      document: {
        data: documentFile.buffer,
        contentType: documentFile.mimetype,
      },
      featured: req.body.featured,
    });

    await newItem.save();

    // Invalidate client cache
    await client.del(DOC_ITEMS_KEY);

    res.status(201).json({ message: "Document item created successfully", id: newItem._id });
  } catch (error) {
    console.error("Error creating document item:", error);
    res.status(500).json({ message: "Failed to create document item", error: error.message });
  }
};

export const getAllDocItems = async (req, res) => {
  try {
    const cached = await client.get(DOC_ITEMS_KEY);
    if (cached) {
      return res.status(200).json(JSON.parse(cached));
    }

    const items = await DocItem.find().select("-image -document");
    await client.set(DOC_ITEMS_KEY, JSON.stringify(items), { EX: 300 }); // Cache for 5 minutes

    res.status(200).json(items);
  } catch (error) {
    console.error("Error fetching document items:", error);
    res.status(500).json({ message: "Failed to fetch document items", error: error.message });
  }
};

export const getFile = async (req, res) => {
  try {
    const { id, fileType } = req.params;
    const cacheKey = `file:${id}:${fileType}`;

    const cachedData = await client.get(cacheKey);
    if (cachedData) {
      const contentType = await client.get(`${cacheKey}:contentType`);
      res.contentType(contentType);
      return res.send(Buffer.from(cachedData, "base64"));
    }

    const item = await DocItem.findById(id);
    if (!item) return res.status(404).json({ message: "Document item not found" });

    let fileData, contentType;
    if (fileType === "image") {
      fileData = item.image.data;
      contentType = item.image.contentType;
    } else if (fileType === "document") {
      fileData = item.document.data;
      contentType = item.document.contentType;
    } else {
      return res.status(400).json({ message: "Invalid file type requested" });
    }

    // Cache file and contentType for 10 minutes
    await client.set(cacheKey, fileData.toString("base64"), { EX: 600 });
    await client.set(`${cacheKey}:contentType`, contentType, { EX: 600 });

    res.contentType(contentType);
    res.send(fileData);
  } catch (error) {
    console.error("Error fetching file:", error);
    res.status(500).json({ message: "Failed to fetch file", error: error.message });
  }
};

export const deleteFile = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedItem = await DocItem.findByIdAndDelete(id);
    if (!deletedItem) return res.status(404).json({ message: "Document item not found" });

    // Invalidate related client cache
    await client.del(DOC_ITEMS_KEY);
    await client.del(`file:${id}:image`, `file:${id}:document`, `file:${id}:image:contentType`, `file:${id}:document:contentType`);

    res.status(200).json({ message: "Document item deleted successfully", item: deletedItem });
  } catch (error) {
    console.error("Error deleting document item:", error);
    res.status(500).json({ message: "Failed to delete document item", error: error.message });
  }
};

export const updateDocItem = async (req, res) => {
  try {
    const item = await DocItem.findById(req.params.id);
    if (!item) return res.status(404).json({ message: "Document item not found" });

    if (req.body.name) item.name = req.body.name;
    if (req.body.description) item.description = req.body.description;
    if (req.body.category) item.category = req.body.category;

    if (req.files?.image) {
      const imageFile = req.files.image[0];
      item.image = {
        data: imageFile.buffer,
        contentType: imageFile.mimetype,
      };
    }

    if (req.files?.document) {
      const docFile = req.files.document[0];
      item.document = {
        data: docFile.buffer,
        contentType: docFile.mimetype,
      };
    }

    await item.save();

    // Invalidate cache
    const id = req.params.id;
    await client.del(DOC_ITEMS_KEY);
    await client.del(`file:${id}:image`, `file:${id}:document`, `file:${id}:image:contentType`, `file:${id}:document:contentType`);

    res.status(200).json({ message: "Document item updated successfully", item });
  } catch (error) {
    console.error("Error updating document item:", error);
    res.status(500).json({ message: "Failed to update document item", error: error.message });
  }
};
