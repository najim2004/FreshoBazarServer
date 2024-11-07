import mongoose from "mongoose";
import bcrypt from "bcryptjs"; // bcrypt library to hash passwords

const userSchema = new mongoose.Schema(
  {
    _id: mongoose.Schema.Types.ObjectId,
    firstName: { type: String, required: true },
    lastName: { type: String },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true }, // Hashed password
    phone: { type: String, required: true },
    role: {
      type: String,
      enum: [
        "consumer",
        "farmer",
        "moderator",
        "admin",
        "delivery_manager",
        "delivery_executive",
        "logistics_coordinator",
      ],
      default: "consumer",
    },
    profileImage: { type: String },
    lastLogin: { type: Date }, // Tracks the last login date and time
    failedLoginAttempts: { type: Number, default: 0 }, // For locking account after repeated failures
    accountLocked: { type: Boolean, default: false }, // Account lock status
    resetPasswordToken: { type: String }, // For password reset functionality
    resetPasswordExpires: { type: Date }, // Expiration date for reset token

    // legal information
    legalDocumentsInfo: {
      photo: { type: String },
      fullName: { type: String, required: true },
      gender: { type: String, enum: ["male", "female", "other"] },
      nationality: { type: String, default: "Bangladeshi" },
      dateOfBirth: { type: Date },
      NIDNumber: { type: String },
      NIDPicture: { type: String },
      passportNumber: { type: String },
      passportPicture: { type: String },
      drivingLicenseNumber: { type: String },
      drivingLicensePicture: { type: String },
      birthCertificateNumber: { type: String },
      birthCertificatePicture: { type: String },
    },

    // Address Information
    addresses: [
      {
        label: { type: String, default: "Home" },
        street: { type: String, required: true },
        city: { type: String, required: true },
        state: { type: String, required: true },
        postalCode: { type: String, required: true },
        country: { type: String, required: true },
        isDefault: { type: Boolean, default: false },
      },
    ],

    // Preferences and Settings
    preferences: {
      notificationPreferences: {
        email: { type: Boolean, default: true },
        sms: { type: Boolean, default: true },
        pushNotifications: { type: Boolean, default: true },
      },
      marketingOptIn: { type: Boolean, default: false }, // For marketing preferences
    },

    // Analytics and Tracking
    lastActive: { type: Date }, // Tracks the last active date and time for the user
    referredBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" }, // Reference for referral programs
    rewardsPoints: { type: Number, default: 0 }, // For loyalty or rewards programs
    recentSearches: { type: [String], default: [] }, // Tracks recent search queries
    browsingHistory: [
      {
        productId: { type: mongoose.Schema.Types.ObjectId, ref: "Product" },
        viewedAt: { type: Date, default: Date.now },
      },
    ],
    // GDPR Compliance Fields
    acceptedTerms: { type: Boolean, default: false },
    acceptedPrivacyPolicy: { type: Boolean, default: false },
    consentForDataProcessing: { type: Boolean, default: false }, // Consent for data processing
    isDelete: { type: Boolean, default: false },
    deletedAt: { type: Date }, // Soft delete feature
  },
  // Timestamps
  { timestamps: true }
);

// Hash password before saving the user document
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next(); // Only hash if password is modified or new
  try {
    // Salt and hash the password
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (err) {
    next(err); // If an error occurs, pass it to the next middleware
  }
});

// Hash password before updating it
userSchema.pre("findOneAndUpdate", async function (next) {
  const update = this.getUpdate();
  if (update.password) {
    try {
      const salt = await bcrypt.genSalt(10);
      update.password = await bcrypt.hash(update.password, salt);
    } catch (err) {
      return next(err); // Pass error to the next middleware
    }
  }
  next();
});

export const User = mongoose.model("User", userSchema);
