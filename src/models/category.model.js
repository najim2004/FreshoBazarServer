import mongoose from "mongoose";

const SubcategorySchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  slug: {
    type: String,
    required: true,
  },
});

const CategorySchema = new mongoose.Schema({
  _id: mongoose.Schema.Types.ObjectId,
  name: {
    type: String,
    required: true,
  },
  slug: {
    type: String,
    required: true,
  },
  subcategories: [SubcategorySchema],
});

export const Category = mongoose.model("Category", CategorySchema);
