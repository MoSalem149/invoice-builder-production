// models/Car.js
import mongoose from "mongoose";

const carSchema = new mongoose.Schema(
  {
    images: [{ type: String, required: true }],
    price: { type: Number, required: true, min: 0 },
    brand: { type: String, required: true, trim: true },
    model: { type: String, required: true, trim: true },
    year: {
      type: Number,
      required: true,
      min: 1900,
      max: new Date().getFullYear() + 1,
    },
    category: {
      type: String,
      enum: ["Sedan", "SUV", "Hatchback", "Coupe", "Crossover"],
      default: "Sedan",
    },
    condition: { type: String, enum: ["New", "Used"], default: "New" },
    transmission: {
      type: String,
      enum: ["Automatic", "Manual"],
      default: "Automatic",
    },
    fuelType: {
      type: String,
      enum: ["Petrol", "Diesel", "Electric", "Hybrid"],
      default: "Petrol",
    },
    mileage: { type: Number, default: 0, min: 0 },
    engineSize: { type: String, trim: true },
    cylinders: { type: Number, default: 4, min: 1 },
    color: { type: String, trim: true },
    doors: { type: Number, default: 4, min: 1 },
    chassisNumber: { type: String, trim: true },
    description: { type: String, trim: true },
    isFeatured: { type: Boolean, default: false },
    bodyType: { type: String, trim: true },
  },
  {
    timestamps: true,
  }
);

// Indexes for better performance
carSchema.index({ brand: 1, model: 1 });
carSchema.index({ price: 1 });
carSchema.index({ isFeatured: 1 });

export default mongoose.model("Car", carSchema);
