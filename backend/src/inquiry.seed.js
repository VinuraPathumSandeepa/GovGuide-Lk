const mongoose = require("mongoose");
const dotenv = require("dotenv");

const Inquiry = require(
    "./modules/inquiryManagement/inquiry.model"
);

dotenv.config();


const sampleInquiries = [
    {
        referenceNumber:
            "INQ-20260904-1001",

        fullName:
            "Nimal Perera",

        email:
            "nimal@example.com",

        phone:
            "0712345678",

        district:
            "Colombo",

        serviceCategory:
            "Identification",

        subject:
            "Passport document clarification",

        message:
            "I would like to know which original documents are required for a new passport application.",

        status:
            "Pending",

        response: "",
    },

    {
        referenceNumber:
            "INQ-20260904-1002",

        fullName:
            "Kavindi Silva",

        email:
            "kavindi@example.com",

        phone:
            "0771234567",

        district:
            "Galle",

        serviceCategory:
            "Transport",

        subject:
            "Driving licence renewal",

        message:
            "I need information about the medical certificate required to renew my driving licence.",

        status:
            "In Progress",

        response:
            "Your inquiry is currently being reviewed.",
    },

    {
        referenceNumber:
            "INQ-20260904-1003",

        fullName:
            "Kasun Fernando",

        email:
            "kasun@example.com",

        phone:
            "0759876543",

        district:
            "Kandy",

        serviceCategory:
            "Business",

        subject:
            "Business registration information",

        message:
            "I would like to know where I should submit documents to register a new business name.",

        status:
            "Resolved",

        response:
            "Please contact the relevant provincial business registration office.",
    },
];


const seedInquiries =
    async () => {
        try {
            await mongoose.connect(
                process.env.MONGO_URI
            );


            console.log(
                "MongoDB connected."
            );


            await Inquiry.deleteMany();


            console.log(
                "Existing inquiry data removed."
            );


            await Inquiry.insertMany(
                sampleInquiries
            );


            console.log(
                "Sample GovGuide LK inquiries inserted successfully."
            );


            process.exit(0);
        } catch (error) {
            console.error(
                "Inquiry database seed failed:"
            );


            console.error(error);


            process.exit(1);
        }
    };


seedInquiries();