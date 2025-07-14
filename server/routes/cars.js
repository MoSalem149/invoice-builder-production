import express from "express";
import Car from "../models/Car.js";
import { authenticate, authorize } from "../middleware/auth.js";
import multer from "multer";
import path from "path";

const router = express.Router();

// Configure storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "public/uploads/cars");
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(
      null,
      file.fieldname + "-" + uniqueSuffix + path.extname(file.originalname)
    );
  },
});

const upload = multer({ storage });

// @route   POST /api/cars/upload
// @desc    Upload car images
// @access  Private (Admin only)
router.post(
  "/upload",
  authenticate,
  authorize("admin"),
  upload.array("images", 10),
  async (req, res) => {
    try {
      if (!req.files || req.files.length === 0) {
        return res.status(400).json({
          success: false,
          message: "No files uploaded",
        });
      }

      const urls = req.files.map((file) => `/uploads/cars/${file.filename}`);

      res.json({
        success: true,
        message: "Files uploaded successfully",
        urls,
      });
    } catch (error) {
      console.error("Upload error:", error);
      res.status(500).json({
        success: false,
        message: "Server error while uploading files",
      });
    }
  }
);

// @route   GET /api/cars
// @desc    Get all cars with optional filters
// @access  Public
router.get("/", async (req, res) => {
  try {
    const filters = {};
    const filterFields = [
      "category",
      "condition",
      "brand",
      "model",
      "year",
      "transmission",
      "fuelType",
      "color",
      "doors",
      "bodyType",
    ];

    filterFields.forEach((field) => {
      if (req.query[field]) {
        filters[field] = req.query[field];
      }
    });

    if (req.query.minPrice || req.query.maxPrice) {
      filters.price = {};
      if (req.query.minPrice) filters.price.$gte = Number(req.query.minPrice);
      if (req.query.maxPrice) filters.price.$lte = Number(req.query.maxPrice);
    }

    if (req.query.minYear || req.query.maxYear) {
      filters.year = {};
      if (req.query.minYear) filters.year.$gte = Number(req.query.minYear);
      if (req.query.maxYear) filters.year.$lte = Number(req.query.maxYear);
    }

    const cars = await Car.find(filters).sort({ createdAt: -1 });
    res.json({ success: true, data: cars });
  } catch (error) {
    console.error("Get cars error:", error);
    res.status(500).json({
      success: false,
      message: "Server error while fetching cars",
      error: process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
});

// @route   GET /api/cars/featured
// @desc    Get featured cars for slider
// @access  Public
router.get("/featured", async (req, res) => {
  try {
    const featuredCars = await Car.find({ isFeatured: true }).limit(5);
    res.json({ success: true, data: featuredCars });
  } catch (error) {
    console.error("Get featured cars error:", error);
    res.status(500).json({
      success: false,
      message: "Server error while fetching featured cars",
    });
  }
});

// @route   GET /api/cars/:id
// @desc    Get single car details
// @access  Public
router.get("/:id", async (req, res) => {
  try {
    const car = await Car.findById(req.params.id);
    if (!car) {
      return res.status(404).json({
        success: false,
        message: "Car not found",
      });
    }
    res.json({ success: true, data: car });
  } catch (error) {
    console.error("Get car details error:", error);
    res.status(500).json({
      success: false,
      message: "Server error while fetching car details",
    });
  }
});

// @route   POST /api/cars
// @desc    Create a new car listing
// @access  Private (Admin only)
router.post("/", authenticate, authorize("admin"), async (req, res) => {
  try {
    // Validate required fields
    const requiredFields = ["brand", "model", "year", "price", "images"];
    const missingFields = requiredFields.filter((field) => !req.body[field]);

    if (missingFields.length > 0) {
      return res.status(400).json({
        success: false,
        message: `Missing required fields: ${missingFields.join(", ")}`,
      });
    }

    // Check for duplicate chassis number
    const existingCar = await Car.findOne({
      chassisNumber: req.body.chassisNumber,
    });

    if (existingCar) {
      return res.status(400).json({
        success: false,
        message: "Car with this chassis number already exists",
      });
    }

    const car = new Car(req.body);
    await car.save();

    res.status(201).json({
      success: true,
      message: "Car created successfully",
      data: car,
    });
  } catch (error) {
    console.error("Create car error:", error);

    let errorMessage = "Server error while creating car";
    if (error.name === "ValidationError") {
      errorMessage = Object.values(error.errors)
        .map((err) => err.message)
        .join(", ");
    }

    res.status(500).json({
      success: false,
      message: errorMessage,
      error: process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
});

// @route   PUT /api/cars/:id
// @desc    Update a car listing
// @access  Private (Admin only)
router.put("/:id", authenticate, authorize("admin"), async (req, res) => {
  try {
    const car = await Car.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!car) {
      return res.status(404).json({
        success: false,
        message: "Car not found",
      });
    }

    res.json({
      success: true,
      message: "Car updated successfully",
      data: car,
    });
  } catch (error) {
    console.error("Update car error:", error);
    res.status(500).json({
      success: false,
      message: "Server error while updating car",
    });
  }
});

// @route   DELETE /api/cars/:id
// @desc    Delete a car listing
// @access  Private (Admin only)
router.delete("/:id", authenticate, authorize("admin"), async (req, res) => {
  try {
    const car = await Car.findByIdAndDelete(req.params.id);

    if (!car) {
      return res.status(404).json({
        success: false,
        message: "Car not found",
      });
    }

    res.json({
      success: true,
      message: "Car deleted successfully",
    });
  } catch (error) {
    console.error("Delete car error:", error);
    res.status(500).json({
      success: false,
      message: "Server error while deleting car",
    });
  }
});

export default router;
