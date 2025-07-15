import mongoose from "mongoose";

const sliderImageSchema = new mongoose.Schema(
  {
    imageUrl: {
      type: String,
      required: function () {
        return !this.isSettings;
      },
    },
    caption: { type: String },
    isActive: { type: Boolean, default: true },
    isSettings: { type: Boolean, default: false },
    isCurrent: { type: Boolean, default: false },
    order: { type: Number, default: 0 },
    autoplay: { type: Boolean, default: true },
    autoplayDelay: { type: Number, default: 5000 },
    loop: { type: Boolean, default: true },
    navigation: { type: Boolean, default: true },
    pagination: { type: Boolean, default: true },
    effect: {
      type: String,
      enum: ["slide", "fade", "cube", "coverflow", "flip"],
      default: "slide",
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("Slider", sliderImageSchema);
