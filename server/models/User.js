import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const userSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      lowercase: true,
      trim: true,
      set: (email) => {
        // Normalize Gmail addresses by removing dots and everything after +
        if (email.includes("@gmail.com")) {
          const [local, domain] = email.split("@");
          const normalizedLocal = local.replace(/\./g, "").split("+")[0];
          return `${normalizedLocal}@${domain}`.toLowerCase();
        }
        return email.toLowerCase();
      },
    },
    password: {
      type: String,
      required: true,
      minlength: 8,
      select: false, // Never return password in queries
    },
    name: {
      type: String,
      required: true,
      trim: true,
    },
    role: {
      type: String,
      enum: ["admin"], // Only admin role exists now
      default: "admin", // All users are admins
      required: true,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    lastLogin: {
      type: Date,
    },
    permissions: {
      type: [String],
      default: [
        "manage_invoices",
        "manage_clients",
        "manage_products",
        "manage_cars",
        "manage_settings",
      ],
      enum: [
        "manage_invoices",
        "manage_clients",
        "manage_products",
        "manage_cars",
        "manage_settings",
        "view_reports",
      ],
    },
    company: {
      logo: { type: String, default: "/images/default-logo.png" },
      name: { type: String, default: "Said Trasporto Gordola" },
      address: { type: String, default: "Via S.Gottardo 100,\n6596 Gordola" },
      email: { type: String, default: "Info@saidauto.ch" },
      phone: { type: String, default: "" },
      currency: { type: String, enum: ["CHF", "USD", "EGY"], default: "CHF" },
      language: { type: String, enum: ["it", "en", "ar"], default: "it" },
      watermark: { type: String, default: "" },
      showNotes: { type: Boolean, default: false },
      showTerms: { type: Boolean, default: false },
      taxRate: { type: Number, default: 0, min: 0, max: 100 },
    },
  },
  {
    timestamps: true,
    toJSON: {
      virtuals: true,
      transform: function (doc, ret) {
        delete ret.password; // Never return password
        delete ret.__v; // Remove version key
        return ret;
      },
    },
    toObject: {
      virtuals: true,
      transform: function (doc, ret) {
        delete ret.password; // Never return password
        delete ret.__v; // Remove version key
        return ret;
      },
    },
  }
);

// Indexes for better query performance
userSchema.index({ email: 1 }, { unique: true }); // Keep this one
userSchema.index({ role: 1 });
userSchema.index({ isActive: 1 });

// Hash password before saving
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();

  try {
    const salt = await bcrypt.genSalt(12);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

// Update last login on successful authentication
userSchema.methods.updateLastLogin = async function () {
  this.lastLogin = new Date();
  await this.save();
};

// Compare password method
userSchema.methods.comparePassword = async function (candidatePassword) {
  try {
    return await bcrypt.compare(candidatePassword, this.password);
  } catch (error) {
    console.error("Password comparison error:", error);
    return false;
  }
};

// Check if user has specific permission
userSchema.methods.hasPermission = function (permission) {
  return this.permissions.includes(permission);
};

// Static method to find admin users
userSchema.statics.findAdmins = function () {
  return this.find({ role: "admin" });
};

// Static method to create initial admin
userSchema.statics.createInitialAdmin = async function () {
  const adminData = {
    name: "System Admin",
    email: "admin@saidauto.ch",
    password: "admin123", // Change this in production!
    role: "admin",
    isActive: true,
    permissions: [
      "manage_invoices",
      "manage_clients",
      "manage_products",
      "manage_cars",
      "manage_settings",
      "view_reports",
    ],
  };

  const existingAdmin = await this.findOne({ email: adminData.email });
  if (!existingAdmin) {
    return this.create(adminData);
  }
  return existingAdmin;
};

export default mongoose.model("User", userSchema);
