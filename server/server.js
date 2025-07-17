import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import { fileURLToPath } from "url";
import { dirname, join } from "path";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import fs from "fs";
import User from "./models/User.js";

// Import routes
import companyRoutes from "./routes/company.js";
import clientRoutes from "./routes/clients.js";
import productRoutes from "./routes/products.js";
import invoiceRoutes from "./routes/invoices.js";
import authRoutes from "./routes/auth.js";
import dashboardRoutes from "./routes/dashboard.js";
import carRoutes from "./routes/cars.js";
import sliderRoutes from "./routes/slider.js";

process.on("uncaughtException", (err) => {
  console.error("Uncaught Exception:", err);
  process.exit(1);
});

process.on("unhandledRejection", (err) => {
  console.error("Unhandled Rejection:", err);
  process.exit(1);
});

dotenv.config();

// Setup __dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
const PORT = process.env.PORT || 5000;

// ✅ Trust Railway's proxy (required for express-rate-limit)
app.set("trust proxy", 1);

// Ensure uploads directory exists
const uploadsDir = join(__dirname, "public", "uploads", "cars");
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

const sliderUploadsDir = join(__dirname, "public", "uploads", "slider");
if (!fs.existsSync(sliderUploadsDir)) {
  fs.mkdirSync(sliderUploadsDir, { recursive: true });
}

// Middleware
app.use(helmet());
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));

const uploadsPath = join(process.cwd(), "public", "uploads");
app.use(
  "/uploads",
  express.static(uploadsPath, {
    setHeaders: (res) => {
      res.setHeader(
        "Access-Control-Allow-Origin",
        process.env.CLIENT_URL || "*"
      );
      res.setHeader("Cross-Origin-Resource-Policy", "cross-origin");
      res.setHeader("Access-Control-Allow-Methods", "GET, OPTIONS");
    },
  })
);

// CORS for API
app.use(
  cors({
    origin: process.env.CLIENT_URL || "http://localhost:3000",
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
    exposedHeaders: ["Content-Disposition"],
  })
);

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: process.env.NODE_ENV === "development" ? 1000 : 100,
});
app.use("/api/", limiter);

// MongoDB connection
mongoose
  .connect(process.env.MONGODB_URI, {
    serverSelectionTimeoutMS: 5000,
    socketTimeoutMS: 45000,
    connectTimeoutMS: 30000,
  })
  .then(() => {
    console.log("✅ Connected to MongoDB");
    createAdminUser();
  })
  .catch((err) => {
    console.error("❌ MongoDB connection error:", err);
    process.exit(1);
  });

// Create default admin user
const createAdminUser = async () => {
  const adminEmail = "admin@saidauto.ch";
  const adminPassword = "admin123";

  const existing = await User.findOne({ email: adminEmail });
  if (!existing) {
    const admin = new User({
      name: "Admin",
      email: adminEmail,
      password: adminPassword,
      role: "admin",
      company: {
        logo: "/images/default-logo.png",
        name: "Said Trasporto Gordola",
        address: "Via S.Gottardo 100,\n6596 Gordola",
        email: "Info@saidauto.ch",
        phone: "",
        currency: "CHF",
        language: "it",
        watermark: "",
        showNotes: false,
        showTerms: false,
        taxRate: 0,
      },
    });
    await admin.save();
    console.log("✅ Admin created");
  }
};

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/company", companyRoutes);
app.use("/api/clients", clientRoutes);
app.use("/api/products", productRoutes);
app.use("/api/invoices", invoiceRoutes);
app.use("/api/dashboard", dashboardRoutes);
app.use("/api/cars", carRoutes);
app.use("/api/slider-images", sliderRoutes);

// Health check
app.get("/api/health", (req, res) => {
  res.status(200).json({
    status: "OK",
    timestamp: new Date().toISOString(),
  });
});

// Not Found
app.use("*", (req, res) => {
  res.status(404).json({ success: false, message: "API endpoint not found" });
});

// Error Handler
app.use((err, req, res, next) => {
  console.error("❌ Error:", err);
  res.status(err.status || 500).json({
    success: false,
    message: err.message || "Internal Server Error",
    ...(process.env.NODE_ENV === "development" && { stack: err.stack }),
  });
});

// Start server
const server = app.listen(PORT, "0.0.0.0", () => {
  console.log(`🚀 Server running on port ${PORT}`);
});

server.keepAliveTimeout = 60000;
