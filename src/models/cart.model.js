import mongoose from "mongoose";

const CartItemSchema = new mongoose.Schema({
  productId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Product",
    required: true,
  },
  name: { type: String, required: true },
  quantity: { type: Number, required: true, min: 1 },
  price: { type: Number, required: true },
  totalPrice: { type: Number, required: true },
  thumbnail: { id:String, url:String },
  options: {
    type: Map,
    of: mongoose.Schema.Types.Mixed,
    default: {},
  },
});

const CartSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    items: {
      type: [CartItemSchema],
      default: [],
    },
    totalQuantity: {
      type: Number,
      default: 0,
    },
    totalPrice: {
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
  this.totalQuantity = this.items.reduce((acc, item) => acc + item.quantity, 0);
  this.totalPrice = this.items.reduce((acc, item) => acc + item.totalPrice, 0);
  next();
});

export const Cart = mongoose.model("Cart", CartSchema);
