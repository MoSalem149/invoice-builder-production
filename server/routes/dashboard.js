import express from "express";
import User from "../models/User.js";
import Client from "../models/Client.js";
import Product from "../models/Product.js";
import Invoice from "../models/Invoice.js";
import { authenticate } from "../middleware/auth.js";

const router = express.Router();

// @route   GET /api/dashboard/global-stats
// @desc    Get global dashboard statistics (public)
// @access  Public
router.get("/global-stats", async (req, res) => {
  try {
    // Get counts from all users (for demo purposes)
    const [totalInvoices, totalClients, totalProducts, invoices] =
      await Promise.all([
        Invoice.countDocuments(),
        Client.countDocuments({ archived: { $ne: true } }),
        Product.countDocuments({ archived: { $ne: true } }),
        Invoice.find().select("total").lean(),
      ]);

    const totalRevenue = invoices.reduce(
      (sum, invoice) => sum + (invoice.total || 0),
      0
    );

    res.json({
      success: true,
      data: {
        totalInvoices,
        totalClients,
        totalProducts,
        totalRevenue,
      },
    });
  } catch (error) {
    console.error("Get global stats error:", error);
    res.status(500).json({
      success: false,
      message: "Server error while fetching global statistics",
    });
  }
});

// @route   GET /api/dashboard/stats
// @desc    Get user dashboard statistics
// @access  Private
router.get("/stats", authenticate, async (req, res) => {
  try {
    const userId = req.user._id;

    const [totalInvoices, totalClients, totalProducts, invoices] =
      await Promise.all([
        Invoice.countDocuments({ userId }),
        Client.countDocuments({ userId, archived: { $ne: true } }),
        Product.countDocuments({ userId, archived: { $ne: true } }),
        Invoice.find({ userId }).select("total").lean(),
      ]);

    const totalRevenue = invoices.reduce(
      (sum, invoice) => sum + (invoice.total || 0),
      0
    );

    const recentInvoices = await Invoice.find({ userId })
      .sort({ createdAt: -1 })
      .limit(5)
      .populate("client.id", "name")
      .lean();

    res.json({
      success: true,
      data: {
        totalInvoices,
        totalClients,
        totalProducts,
        totalRevenue,
        recentInvoices,
        quickActions: [
          {
            title: "Create New Invoice",
            description: "Generate a new invoice for your clients",
            path: "/invoices/new",
          },
          {
            title: "Settings",
            description: "Configure your company details and preferences",
            path: "/settings",
          },
          {
            title: "View Invoice History",
            description: "Browse and manage your past invoices",
            path: "/invoices",
          },
        ],
      },
    });
  } catch (error) {
    console.error("Get dashboard stats error:", error);
    res.status(500).json({
      success: false,
      message: "Server error while fetching dashboard statistics",
    });
  }
});

export default router;
