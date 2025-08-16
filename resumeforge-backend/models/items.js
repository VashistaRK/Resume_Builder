import mongoose from "mongoose";

const docItemSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String },
  category: { type: String },
  image: {
    data: Buffer,
    contentType: String,
  },
  document: {
    data: Buffer,
    contentType: String,
  },
  featured:{ type:Boolean},
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.model("DocItem", docItemSchema);
