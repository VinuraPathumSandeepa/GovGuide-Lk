const mongoose = require("mongoose");

const officeSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Office name is required"],
      trim: true,
      minlength: [3, "Office name must contain at least 3 characters"],
    },

    officeType: {
      type: String,
      required: [true, "Office type is required"],
      trim: true,
      enum: [
        "Government Department",
        "Divisional Secretariat",
        "District Secretariat",
        "Municipal Council",
        "Provincial Office",
        "Service Center",
        "Other",
      ],
    },

    district: {
      type: String,
      required: [true, "District is required"],
      trim: true,
    },

    address: {
      type: String,
      required: [true, "Office address is required"],
      trim: true,
      minlength: [5, "Please enter a valid office address"],
    },

    phone: {
      type: String,
      required: [true, "Phone number is required"],
      trim: true,
    },

    email: {
      type: String,
      trim: true,
      lowercase: true,
      default: "",
    },

    openingHours: {
      type: String,
      required: [true, "Opening hours are required"],
      trim: true,
    },

    availableServices: {
      type: [String],
      default: [],
    },

    description: {
      type: String,
      trim: true,
      default: "",
    },
  },
  {
    timestamps: true,
  }
);

const Office = mongoose.model("Office", officeSchema);

module.exports = Office;