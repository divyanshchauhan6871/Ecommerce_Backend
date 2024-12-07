import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
    },
    slug: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
    category: {
      type: mongoose.Schema.Types.ObjectId, // Correct type for referencing another document
      ref: "Category", // Reference to the "Category" collection
      required: true,
    },

    photo: {
      data: Buffer,
      contentType: String,
    },
    shipping: {
      type: Boolean,
    },
    quantity: { type: Number, required: true },
  },
  { timestamps: true }
);

export default mongoose.model("Products", productSchema);
