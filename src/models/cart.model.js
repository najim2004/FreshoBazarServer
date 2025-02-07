import mongoose from "mongoose";

const CartItemSchema = new mongoose.Schema({
  product_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Product",
    required: true,
  },
  quantity: { type: Number, required: true, min: 1 }
});

const CartSchema = new mongoose.Schema(
  {
    user_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    items: {
      type: [CartItemSchema],
      default: [],
    },
    status: {
      type: String,
      enum: ["active", "pending", "completed"],
      default: "active",
    },
  },
  { timestamps: true }
);
CartSchema.path("items").schema.set("_id", false);
export const Cart = mongoose.model("Cart", CartSchema);
