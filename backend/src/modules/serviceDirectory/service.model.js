const mongoose = require("mongoose");

const serviceSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Service name is required"],
      trim: true,
      minlength: [3, "Service name must contain at least 3 characters"],
    },

    category: {
      type: String,
      required: [true, "Category is required"],
      trim: true,
      enum: [
        "Identification",
        "Transport",
        "Education",
        "Health",
        "Business",
        "Social Services",
        "Land & Property",
        "Other",
      ],
    },

    department: {
      type: String,
      required: [true, "Department name is required"],
      trim: true,
    },

    description: {
      type: String,
      required: [true, "Description is required"],
      trim: true,
      minlength: [10, "Description must contain at least 10 characters"],
    },

    requiredDocuments: {
      type: [String],
      default: [],
    },

    fee: {
      type: Number,
      required: [true, "Fee is required"],
      min: [0, "Fee cannot be negative"],
      default: 0,
    },

    processingTime: {
      type: String,
      required: [true, "Processing time is required"],
      trim: true,
    },

    eligibility: {
      type: String,
      default: "General public",
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

const Service = mongoose.model("Service", serviceSchema);

module.exports = Service;