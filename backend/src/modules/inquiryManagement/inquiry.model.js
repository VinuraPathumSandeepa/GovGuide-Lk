const mongoose = require("mongoose");

const inquirySchema = new mongoose.Schema(
    {
        referenceNumber: {
            type: String,
            required: true,
            unique: true,
            trim: true,
        },

        fullName: {
            type: String,
            required: [true, "Full name is required"],
            trim: true,
            minlength: [
                3,
                "Full name must contain at least 3 characters",
            ],
        },

        email: {
            type: String,
            required: [true, "Email address is required"],
            trim: true,
            lowercase: true,
        },

        phone: {
            type: String,
            required: [true, "Phone number is required"],
            trim: true,
        },

        district: {
            type: String,
            required: [true, "District is required"],
            trim: true,
        },

        serviceCategory: {
            type: String,
            required: [true, "Service category is required"],
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

        subject: {
            type: String,
            required: [true, "Inquiry subject is required"],
            trim: true,
            minlength: [
                4,
                "Subject must contain at least 4 characters",
            ],
        },

        message: {
            type: String,
            required: [true, "Inquiry message is required"],
            trim: true,
            minlength: [
                10,
                "Inquiry message must contain at least 10 characters",
            ],
        },

        status: {
            type: String,
            enum: [
                "Pending",
                "In Progress",
                "Resolved",
            ],
            default: "Pending",
        },

        response: {
            type: String,
            trim: true,
            default: "",
        },
    },
    {
        timestamps: true,
    }
);

const Inquiry = mongoose.model(
    "Inquiry",
    inquirySchema
);

module.exports = Inquiry;