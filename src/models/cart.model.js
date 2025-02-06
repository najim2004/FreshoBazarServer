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
    total_quantity: {
      type: Number,
      default: 0,
    },
    status: {
      type: String,
      enum: ["active", "pending", "completed"],
      default: "active",
    },
  },
  { timestamps: true }
);

// Middleware to calculate total quantity and price before saving the cart
CartSchema.pre("save", function (next) {
  this.total_quantity = this.items.reduce(
    (acc, item) => acc + item.quantity,
    0
  );
  next();
});

export const Cart = mongoose.model("Cart", CartSchema);
