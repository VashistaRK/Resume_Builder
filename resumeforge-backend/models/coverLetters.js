import mongoose from "mongoose";

const CoverItem = new mongoose.Schema({
  name: { type: String, required: true },
  purpose: { type: String },
  image: {
    data: Buffer,
    contentType: String,
  },
  document: {
    data: Buffer,
    contentType: String,
  },
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.model("CoverItem", CoverItem);
