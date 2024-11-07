import mongoose from "mongoose";
import slugify from "slugify";

const productSchema = new mongoose.Schema(
  {
    isDelete: {
      type: Boolean,
      default: false,
    },
    isAvailable: {
      type: Boolean,
      required: true,
    },
    title: {
      type: String,
      required: true,
    },
    slug: {
      type: String,
      unique: true,
    },
    description: {
      type: String,
    },
    images: {
      type: [String],
      required: true,
    },
    thumbnail: {
      type: String,
    },
    categoryId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
    },
    categoryName: { type: String, default: "all", required: true },
    subCategories: {
      type: [String],
      default: ["all"],
    },
    unitType: {
      type: String,
      required: true,
      enum: ["kg", "g", "l", "ml", "piece"],
    },
    unitSize: {
      type: Number,
      required: true,
    },
    stockSize: {
      type: Number,
      required: true,
    },
    price: {
      type: Number,
      required: true,
      min: 0,
    },
    currency: {
      type: String,
      default: "BDT",
    },
    isDiscountable: {
      type: Boolean,
      default: false,
    },
    discountValue: {
      type: Number,
      default: 0,
    },
    averageRating: {
      type: Number,
      default: 0,
    },
    ratingsCount: {
      type: Number,
      default: 0,
    },
    tags: {
      type: [String],
      required: true,
    },
    location: {
      subDistrict: {
        type: String,
      },
      district: {
        type: String,
      },
    },
  },
  { timestamps: true }
);

// Slug তৈরি করার জন্য pre save middleware
productSchema.pre("save", async function (next) {
  if (this.title) {
    let slug = slugify(this.title, { lower: true, strict: true });

    // Slug চেক করতে হবে যদি এটি আগে থেকেই ডাটাবেসে থাকে
    const existingProduct = await mongoose.models.Product.findOne({ slug });

    if (existingProduct) {
      // যদি স্লাগটি ডুপ্লিকেট হয়, তাহলে স্লাগের সাথে সংখ্যা যোগ করুন
      slug = `${slug}-${Math.floor(Math.random() * 1000)}`;
    }

    // স্লাগ ফিল্ডে সেট করা
    this.slug = slug;
  }
  next();
});

export const Product = mongoose.model("Product", productSchema);
