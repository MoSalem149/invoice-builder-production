import mongoose from "mongoose";

const invoiceItemSchema = new mongoose.Schema({
  id: {
    type: String,
    required: true,
  },
  name: {
    type: String,
    required: true,
    trim: true,
  },
  description: {
    type: String,
    trim: true,
    default: "",
  },
  quantity: {
    type: Number,
    required: true,
    min: 1,
  },
  price: {
    type: Number,
    required: true,
    min: 0,
  },
  discount: {
    type: Number,
    required: true,
    min: 0,
    max: 100,
    default: 0,
  },
  amount: {
    type: Number,
    required: true,
    min: 0,
  },
});

const invoiceSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    number: {
      type: String,
      required: true,
      trim: true,
      unique: true,
    },
    date: {
      type: Date,
      required: true,
      default: Date.now,
    },
    client: {
      id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Client",
        required: true,
      },
      name: {
        type: String,
        required: true,
      },
      address: {
        type: String,
        default: "",
      },
      phone: {
        type: String,
      },
      email: {
        type: String,
      },
    },
    items: [invoiceItemSchema],
    subtotal: {
      type: Number,
      required: true,
      min: 0,
    },
    tax: {
      type: Number,
      required: true,
      min: 0,
    },
    total: {
      type: Number,
      required: true,
      min: 0,
    },
    paid: {
      type: Boolean,
      required: true,
      default: false,
    },
    hideStatus: {
      type: Boolean,
      default: false,
    },
    showStatusWatermark: {
      type: Boolean,
      default: false,
    },
    notes: {
      type: String,
      default: "",
      trim: true,
    },
    terms: {
      type: String,
      default: "",
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

invoiceSchema.index({ userId: 1, number: 1 });
invoiceSchema.index({ userId: 1, date: -1 });
invoiceSchema.index({ userId: 1, "client.id": 1 });
invoiceSchema.index({ userId: 1, paid: 1 });

export default mongoose.model("Invoice", invoiceSchema);
