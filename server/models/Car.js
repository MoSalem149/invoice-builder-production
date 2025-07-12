import mongoose from "mongoose";

const carSchema = new mongoose.Schema({
  images: [{ type: String, required: true }],
  price: { type: Number, required: true },
  category: {
    type: String,
    enum: ["Sedan", "SUV", "Hatchback", "Coupe", "Crossover"],
    required: true,
  },
  condition: { type: String, enum: ["New", "Used"], required: true },
  brand: { type: String, required: true },
  model: { type: String, required: true },
  year: { type: Number, required: true },
  transmission: { type: String, enum: ["Automatic", "Manual"], required: true },
  fuelType: {
    type: String,
    enum: ["Petrol", "Diesel", "Electric", "Hybrid"],
    required: true,
  },
  mileage: { type: Number, required: true },
  engineSize: { type: Number, required: true },
  cylinders: { type: Number, required: true },
  color: { type: String, required: true },
  doors: { type: Number, required: true },
  chassisNumber: { type: String, required: true, unique: true },
  description: { type: String },
  isFeatured: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now },
});

// Indexes for better performance
carSchema.index({ brand: 1, model: 1 });
carSchema.index({ price: 1 });
carSchema.index({ isFeatured: 1 });

export default mongoose.model("Car", carSchema);
