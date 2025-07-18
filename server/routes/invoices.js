import express from "express";
import { body, validationResult } from "express-validator";
import Invoice from "../models/Invoice.js";
import Client from "../models/Client.js";
import { authenticate } from "../middleware/auth.js";
import nodemailer from "nodemailer";
import { htmlToPdf } from "../utils/pdfGenerator.js";
import multer from "multer";

const router = express.Router();
const upload = multer();

// @route   GET /api/invoices
// @desc    Get all invoices for user
// @access  Private
router.get("/", authenticate, async (req, res) => {
  try {
    const { status, page = 1, limit = 50, search } = req.query;
    const filter = { userId: req.user._id };

    if (status) {
      filter.paid = status === "paid";
    }

    // Add search functionality
    if (search) {
      filter.$or = [
        { number: { $regex: search, $options: "i" } },
        { "client.name": { $regex: search, $options: "i" } },
      ];
    }

    const options = {
      page: parseInt(page),
      limit: parseInt(limit),
      sort: { createdAt: -1 },
    };

    const invoices = await Invoice.find(filter)
      .sort(options.sort)
      .limit(options.limit * 1)
      .skip((options.page - 1) * options.limit)
      .lean();

    // Format dates to YYYY-MM-DD
    const formattedInvoices = invoices.map((invoice) => ({
      ...invoice,
      date: invoice.date.toISOString().split("T")[0],
    }));

    const total = await Invoice.countDocuments(filter);

    res.json({
      success: true,
      data: {
        invoices: formattedInvoices,
        pagination: {
          page: options.page,
          limit: options.limit,
          total,
          pages: Math.ceil(total / options.limit),
        },
      },
    });
  } catch (error) {
    console.error("Get invoices error:", error);
    res.status(500).json({
      success: false,
      message: "Server error while fetching invoices",
    });
  }
});

// @route   GET /api/invoices/:id
// @desc    Get single invoice
// @access  Private
router.get("/:id", authenticate, async (req, res) => {
  try {
    const invoice = await Invoice.findOne({
      _id: req.params.id,
      userId: req.user._id,
    }).lean();

    if (!invoice) {
      return res.status(404).json({
        success: false,
        message: "Invoice not found",
      });
    }

    invoice.date = invoice.date.toISOString().split("T")[0];

    res.json({
      success: true,
      data: invoice,
    });
  } catch (error) {
    console.error("Get invoice error:", error);
    res.status(500).json({
      success: false,
      message: "Server error while fetching invoice",
    });
  }
});

// @route   POST /api/invoices
// @desc    Create a new invoice
// @access  Private
router.post(
  "/",
  authenticate,
  [
    body("number")
      .trim()
      .isLength({ min: 1 })
      .withMessage("Invoice number is required"),
    body("date").isISO8601().withMessage("Valid invoice date is required"),
    body("paid").isBoolean().withMessage("Paid status must be a boolean"),
    body("client").isObject().withMessage("Client information is required"),
    body("client.id").isMongoId().withMessage("Valid client ID is required"),
    body("client.name")
      .trim()
      .isLength({ min: 1 })
      .withMessage("Client name is required"),
    body("client.address").optional().trim(),
    body("client.phone").optional().trim(),
    body("client.email")
      .optional()
      .trim()
      .isEmail()
      .withMessage("Invalid email format"),
    body("items")
      .isArray({ min: 1 })
      .withMessage("At least one item is required"),
    body("items.*.id").isString().withMessage("Item ID is required"),
    body("items.*.name")
      .trim()
      .isLength({ min: 1 })
      .withMessage("Item name is required"),
    body("items.*.description").optional().trim(),
    body("items.*.quantity")
      .isInt({ min: 1 })
      .withMessage("Item quantity must be at least 1"),
    body("items.*.discount")
      .isFloat({ min: 0, max: 100 })
      .withMessage("Item discount must be between 0 and 100"),
    body("items.*.amount")
      .isFloat({ min: 0 })
      .withMessage("Item amount must be positive"),
    body("subtotal")
      .isFloat({ min: 0 })
      .withMessage("Subtotal must be a positive number"),
    body("tax")
      .isFloat({ min: 0 })
      .withMessage("Tax must be a positive number"),
    body("total")
      .isFloat({ min: 0 })
      .withMessage("Total must be a positive number"),
    body("notes").optional().trim(),
    body("terms").optional().trim(),
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          success: false,
          message: "Validation failed",
          errors: errors.array(),
        });
      }

      // Check if invoice number already exists for this user
      const existingInvoice = await Invoice.findOne({
        userId: req.user._id,
        number: req.body.number,
      });

      if (existingInvoice) {
        return res.status(400).json({
          success: false,
          message: "Invoice number already exists",
        });
      }

      // Verify client exists and belongs to user
      const client = await Client.findOne({
        _id: req.body.client.id,
        userId: req.user._id,
      });

      if (!client) {
        return res.status(400).json({
          success: false,
          message: "Client not found or doesn't belong to user",
        });
      }

      // Create invoice with snapshot of client data
      const invoice = new Invoice({
        userId: req.user._id,
        number: req.body.number,
        date: new Date(req.body.date),
        paid: req.body.paid,
        client: {
          id: client._id,
          name: client.name,
          address: client.address || "",
          phone: client.phone || "",
          email: client.email || "",
        },
        items: req.body.items,
        subtotal: req.body.subtotal,
        tax: req.body.tax,
        total: req.body.total,
        notes: req.body.notes || "",
        terms: req.body.terms || "",
      });

      await invoice.save();

      res.status(201).json({
        success: true,
        message: "Invoice created successfully",
        data: invoice,
      });
    } catch (error) {
      console.error("Create invoice error:", error);
      res.status(500).json({
        success: false,
        message: "Server error while creating invoice",
      });
    }
  }
);

// @route   PUT /api/invoices/:id
// @desc    Update an invoice
// @access  Private
router.put(
  "/:id",
  authenticate,
  [
    body("number")
      .optional()
      .trim()
      .isLength({ min: 1 })
      .withMessage("Invoice number is required"),
    body("date")
      .optional()
      .isISO8601()
      .withMessage("Valid invoice date is required"),
    body("paid")
      .optional()
      .isBoolean()
      .withMessage("Paid status must be a boolean"),
    body("client")
      .optional()
      .isObject()
      .withMessage("Client information must be an object"),
    body("items")
      .optional()
      .isArray({ min: 1 })
      .withMessage("At least one item is required"),
    body("subtotal")
      .optional()
      .isFloat({ min: 0 })
      .withMessage("Subtotal must be a positive number"),
    body("tax")
      .optional()
      .isFloat({ min: 0 })
      .withMessage("Tax must be a positive number"),
    body("total")
      .optional()
      .isFloat({ min: 0 })
      .withMessage("Total must be a positive number"),
    body("notes").optional().trim(),
    body("terms").optional().trim(),
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          success: false,
          message: "Validation failed",
          errors: errors.array(),
        });
      }

      // If updating invoice number, check for duplicates
      if (req.body.number) {
        const existingInvoice = await Invoice.findOne({
          userId: req.user._id,
          number: req.body.number,
          _id: { $ne: req.params.id },
        });

        if (existingInvoice) {
          return res.status(400).json({
            success: false,
            message: "Invoice number already exists",
          });
        }
      }

      // If updating client, verify client exists and update client snapshot
      if (req.body.client && req.body.client.id) {
        const client = await Client.findOne({
          _id: req.body.client.id,
          userId: req.user._id,
        });

        if (!client) {
          return res.status(400).json({
            success: false,
            message: "Client not found or doesn't belong to user",
          });
        }

        // Update client snapshot
        req.body.client = {
          id: client._id,
          name: client.name,
          address: client.address || "",
          phone: client.phone || "",
          email: client.email || "",
        };
      }

      // Convert date string to Date object if provided
      if (req.body.date) {
        req.body.date = new Date(req.body.date);
      }

      const invoice = await Invoice.findOneAndUpdate(
        { _id: req.params.id, userId: req.user._id },
        req.body,
        { new: true, runValidators: true }
      );

      if (!invoice) {
        return res.status(404).json({
          success: false,
          message: "Invoice not found",
        });
      }

      // Format date to YYYY-MM-DD
      const formattedInvoice = {
        ...invoice.toObject(),
        date: invoice.date.toISOString().split("T")[0],
      };

      res.json({
        success: true,
        message: "Invoice updated successfully",
        data: formattedInvoice,
      });
    } catch (error) {
      console.error("Update invoice error:", error);
      res.status(500).json({
        success: false,
        message: "Server error while updating invoice",
      });
    }
  }
);

// @route   PUT /api/invoices/:id/status
// @desc    Update invoice paid status
// @access  Private
router.put(
  "/:id/status",
  authenticate,
  [body("paid").isBoolean().withMessage("Paid status must be a boolean")],
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          success: false,
          message: "Validation failed",
          errors: errors.array(),
        });
      }

      const invoice = await Invoice.findOneAndUpdate(
        { _id: req.params.id, userId: req.user._id },
        { paid: req.body.paid },
        { new: true }
      );

      if (!invoice) {
        return res.status(404).json({
          success: false,
          message: "Invoice not found",
        });
      }

      // Format date to YYYY-MM-DD
      const formattedInvoice = {
        ...invoice.toObject(),
        date: invoice.date.toISOString().split("T")[0],
      };

      res.json({
        success: true,
        message: "Invoice status updated successfully",
        data: formattedInvoice,
      });
    } catch (error) {
      console.error("Update invoice status error:", error);
      res.status(500).json({
        success: false,
        message: "Server error while updating invoice status",
      });
    }
  }
);

// @route   POST /api/invoices/send-email
// @desc    Send invoice as PDF via email
// @access  Private
router.post(
  "/send-email",
  authenticate,
  upload.single("invoice"),
  async (req, res) => {
    try {
      const { clientEmail, invoiceNumber } = req.body;

      if (!clientEmail || !invoiceNumber) {
        return res.status(400).json({
          success: false,
          message: "Client email and invoice number are required",
        });
      }

      if (!req.file) {
        return res.status(400).json({
          success: false,
          message: "Invoice HTML file is required",
        });
      }

      if (!req.user?.company?.email || !req.user?.company?.name) {
        return res.status(400).json({
          success: false,
          message: "Company email or name not configured",
        });
      }

      let invoiceHtml = req.file.buffer.toString("utf8");

      if (invoiceHtml.includes('src="/images/default-logo.png"')) {
        invoiceHtml = invoiceHtml.replace(
          'src="/images/default-logo.png"',
          `src="${
            process.env.BASE_URL || "http://localhost:5000"
          }/images/default-logo.png"`
        );
      }

      const pdfBuffer = await htmlToPdf(invoiceHtml);

      const transporter = nodemailer.createTransport({
        host: "smtp.gmail.com",
        port: 465,
        secure: true,
        auth: {
          user: process.env.EMAIL_USER,
          pass: process.env.EMAIL_PASSWORD,
        },
      });

      const mailOptions = {
        from: `"${req.user.company.name}" <${req.user.company.email}>`,
        to: clientEmail,
        subject: `Invoice ${invoiceNumber}`,
        text: `Hello,\n\nPlease find attached invoice ${invoiceNumber}.\n\nThank you,\n${req.user.company.name}`,
        attachments: [
          {
            filename: `invoice_${invoiceNumber}.pdf`,
            content: pdfBuffer,
            contentType: "application/pdf",
          },
        ],
      };

      await transporter.sendMail(mailOptions);

      res.json({
        success: true,
        message: "Invoice sent successfully",
      });
    } catch (error) {
      console.error("Send invoice email error:", error);
      res.status(500).json({
        success: false,
        message: "Failed to send invoice via email",
      });
    }
  }
);

// @route   DELETE /api/invoices/:id
// @desc    Delete an invoice
// @access  Private
router.delete("/:id", authenticate, async (req, res) => {
  try {
    const invoice = await Invoice.findOneAndDelete({
      _id: req.params.id,
      userId: req.user._id,
    });

    if (!invoice) {
      return res.status(404).json({
        success: false,
        message: "Invoice not found",
      });
    }

    res.json({
      success: true,
      message: "Invoice deleted successfully",
    });
  } catch (error) {
    console.error("Delete invoice error:", error);
    res.status(500).json({
      success: false,
      message: "Server error while deleting invoice",
    });
  }
});

export default router;
