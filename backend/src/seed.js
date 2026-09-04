const mongoose = require("mongoose");
const dotenv = require("dotenv");

const Service = require(
  "./modules/serviceDirectory/service.model"
);

dotenv.config();


const sampleServices = [
  {
    name: "National Identity Card Application",
    category: "Identification",
    department: "Department for Registration of Persons",
    description:
      "Information for citizens applying for a Sri Lankan National Identity Card.",
    requiredDocuments: [
      "Birth Certificate",
      "Completed Application Form",
      "Recent Photographs",
    ],
    fee: 200,
    processingTime: "2 - 4 weeks",
    eligibility: "Sri Lankan citizens",
  },

  {
    name: "Passport Application",
    category: "Identification",
    department: "Department of Immigration and Emigration",
    description:
      "Information required when applying for a Sri Lankan passport.",
    requiredDocuments: [
      "National Identity Card",
      "Birth Certificate",
      "Passport Photographs",
    ],
    fee: 5000,
    processingTime: "Approximately 14 working days",
    eligibility: "Sri Lankan citizens",
  },

  {
    name: "Driving Licence Renewal",
    category: "Transport",
    department: "Department of Motor Traffic",
    description:
      "Guidance for renewing an existing Sri Lankan driving licence.",
    requiredDocuments: [
      "Current Driving Licence",
      "National Identity Card",
      "Medical Certificate",
    ],
    fee: 2500,
    processingTime: "1 - 7 working days",
    eligibility: "Existing driving licence holders",
  },

  {
    name: "Business Name Registration",
    category: "Business",
    department: "Relevant Provincial Business Registration Office",
    description:
      "Basic guidance for registering a business name in Sri Lanka.",
    requiredDocuments: [
      "National Identity Card",
      "Business Address Information",
      "Completed Registration Form",
    ],
    fee: 1500,
    processingTime: "3 - 10 working days",
    eligibility: "Individuals starting a business",
  },

  {
    name: "University Student Bursary Information",
    category: "Education",
    department: "Relevant Higher Education Institution",
    description:
      "General information for students seeking financial assistance through available bursary schemes.",
    requiredDocuments: [
      "Student Identification",
      "Income Information",
      "Application Form",
    ],
    fee: 0,
    processingTime: "Depends on institution",
    eligibility: "Eligible higher education students",
  },
];


const seedDatabase = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);

    console.log("MongoDB connected.");

    await Service.deleteMany();

    console.log("Existing service data removed.");

    await Service.insertMany(sampleServices);

    console.log("Sample GovGuide LK services inserted successfully.");

    process.exit(0);
  } catch (error) {
    console.error("Database seed failed:");

    console.error(error);

    process.exit(1);
  }
};


seedDatabase();