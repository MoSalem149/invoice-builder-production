import express from "express";
import SliderImage from "../models/Slider.js";
import { authenticate, authorize } from "../middleware/auth.js";
import multer from "multer";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const router = express.Router();

// Configure storage for slider images
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "public/uploads/slider");
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, "slider-" + uniqueSuffix + path.extname(file.originalname));
  },
});

const upload = multer({
  storage,
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith("image/")) {
      cb(null, true);
    } else {
      cb(new Error("Only image files are allowed!"));
    }
  },
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB limit
  },
});

// Utility function to get default settings
const getDefaultSettings = () => ({
  autoplay: true,
  autoplayDelay: 5000,
  loop: true,
  navigation: true,
  pagination: true,
  effect: "slide",
});

// @route   GET /api/slider-images
// @desc    Get all slider images
// @access  Public
router.get("/", async (req, res) => {
  try {
    const images = await SliderImage.find({
      isActive: true,
      isSettings: { $ne: true },
    }).sort({ order: 1, createdAt: -1 });

    res.json({ success: true, data: images });
  } catch (error) {
    console.error("Get slider images error:", error);
    res.status(500).json({
      success: false,
      message: "Server error while fetching slider images",
    });
  }
});

// @route   GET /api/slider-images/settings
// @desc    Get slider settings
// @access  Public
router.get("/settings", async (req, res) => {
  try {
    // Find the most recent settings document (marked as isSettings: true)
    const settings = await SliderImage.findOne({ isSettings: true })
      .sort({ createdAt: -1 })
      .lean();

    if (!settings) {
      return res.json({
        success: true,
        data: getDefaultSettings(),
      });
    }

    // Remove MongoDB-specific fields and unnecessary fields
    const { _id, __v, createdAt, updatedAt, ...cleanSettings } = settings;

    res.json({
      success: true,
      data: cleanSettings,
    });
  } catch (error) {
    console.error("Get slider settings error:", error);
    res.status(500).json({
      success: false,
      message: "Server error while fetching slider settings",
    });
  }
});

// @route   POST /api/slider-images/settings
// @desc    Save slider settings
// @access  Private (Admin only)
// Update the settings route to handle missing fields better
router.post("/settings", authenticate, authorize("admin"), async (req, res) => {
  try {
    // Get default settings as fallback
    const defaultSettings = getDefaultSettings();

    // Merge request body with default settings
    const settings = {
      ...defaultSettings,
      ...req.body,
    };

    // First, mark all existing settings as not current
    await SliderImage.updateMany(
      { isSettings: true },
      { $set: { isCurrent: false } }
    );

    // Create new settings document
    const newSettings = new SliderImage({
      ...settings,
      isSettings: true,
      isCurrent: true,
    });

    await newSettings.save();

    // Remove MongoDB-specific fields from the response
    const { _id, __v, createdAt, updatedAt, ...responseData } =
      newSettings.toObject();

    res.json({
      success: true,
      message: "Slider settings saved successfully",
      data: responseData,
    });
  } catch (error) {
    console.error("Save slider settings error:", error);
    res.status(500).json({
      success: false,
      message: error.message || "Server error while saving slider settings",
    });
  }
});

// @route   POST /api/slider-images
// @desc    Upload a new slider image
// @access  Private (Admin only)
router.post(
  "/",
  authenticate,
  authorize("admin"),
  upload.single("image"),
  async (req, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({
          success: false,
          message: "No image file uploaded",
        });
      }

      const imageUrl =
        process.env.NODE_ENV === "production"
          ? `${process.env.CLIENT_URL}/uploads/slider/${req.file.filename}`
          : `/uploads/slider/${req.file.filename}`;

      // Get current settings
      const currentSettings =
        (await SliderImage.findOne({
          isSettings: true,
          isCurrent: true,
        }).lean()) || getDefaultSettings();

      const newImage = new SliderImage({
        imageUrl,
        caption: req.body.caption || "",
        ...currentSettings,
        isSettings: false,
        isActive: true,
      });

      await newImage.save();

      res.status(201).json({
        success: true,
        message: "Slider image uploaded successfully",
        data: newImage,
      });
    } catch (error) {
      console.error("Upload slider image error:", error);
      res.status(500).json({
        success: false,
        message: error.message || "Server error while uploading slider image",
      });
    }
  }
);

// @route   PUT /api/slider-images/:id
// @desc    Update slider image (caption, order, etc.)
// @access  Private (Admin only)
router.put("/:id", authenticate, authorize("admin"), async (req, res) => {
  try {
    const { caption, order, isActive } = req.body;

    const updatedImage = await SliderImage.findByIdAndUpdate(
      req.params.id,
      { caption, order, isActive },
      { new: true }
    );

    if (!updatedImage) {
      return res.status(404).json({
        success: false,
        message: "Slider image not found",
      });
    }

    res.json({
      success: true,
      message: "Slider image updated successfully",
      data: updatedImage,
    });
  } catch (error) {
    console.error("Update slider image error:", error);
    res.status(500).json({
      success: false,
      message: "Server error while updating slider image",
    });
  }
});

// @route   DELETE /api/slider-images/:id
// @desc    Delete a slider image
// @access  Private (Admin only)
router.delete("/:id", authenticate, authorize("admin"), async (req, res) => {
  try {
    const image = await SliderImage.findById(req.params.id);

    if (!image) {
      return res.status(404).json({
        success: false,
        message: "Slider image not found",
      });
    }

    // Delete the image file from the filesystem
    if (image.imageUrl) {
      const filename = image.imageUrl.split("/").pop();
      const filePath = path.join(
        process.cwd(), // Changed from __dirname to process.cwd()
        "public",
        "uploads",
        "slider",
        filename
      );

      try {
        if (fs.existsSync(filePath)) {
          fs.unlinkSync(filePath);
          console.log("File successfully deleted");
        } else {
          console.warn("File not found at:", filePath);
        }
      } catch (fileError) {
        console.error("File deletion error:", fileError);
        // Continue with DB deletion even if file deletion fails
      }
    }

    // Delete from database
    await SliderImage.findByIdAndDelete(req.params.id);

    res.json({
      success: true,
      message: "Slider image deleted successfully",
    });
  } catch (error) {
    console.error("Delete slider image error:", error);
    res.status(500).json({
      success: false,
      message: "Server error while deleting slider image",
    });
  }
});

export default router;
