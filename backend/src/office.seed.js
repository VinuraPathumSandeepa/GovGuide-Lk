const mongoose = require("mongoose");
const dotenv = require("dotenv");

const Office = require(
  "./modules/officeDirectory/office.model"
);

dotenv.config();


const sampleOffices = [
  {
    name: "Department of Immigration and Emigration",
    officeType: "Government Department",
    district: "Colombo",
    address:
      "Suhurupaya, Sri Subhuthipura Road, Battaramulla",
    phone: "0115329000",
    email: "controller@immigration.gov.lk",
    openingHours: "Monday - Friday, 8:30 AM - 4:15 PM",
    availableServices: [
      "Passport Application",
      "Passport Renewal",
      "Visa Information",
    ],
    description:
      "Provides passport, immigration and emigration related public services.",
  },

  {
    name: "Department for Registration of Persons",
    officeType: "Government Department",
    district: "Colombo",
    address:
      "Battaramulla, Colombo",
    phone: "0115226100",
    email: "",
    openingHours: "Monday - Friday, 8:30 AM - 4:15 PM",
    availableServices: [
      "National Identity Card Application",
      "NIC Replacement",
      "NIC Information",
    ],
    description:
      "Provides services related to Sri Lankan National Identity Cards.",
  },

  {
    name: "Colombo District Secretariat",
    officeType: "District Secretariat",
    district: "Colombo",
    address:
      "Dam Street, Colombo 12",
    phone: "0112434902",
    email: "",
    openingHours: "Monday - Friday, 8:30 AM - 4:15 PM",
    availableServices: [
      "Public Administration Services",
      "Land Services",
      "Social Services",
    ],
    description:
      "Provides district-level administrative services for citizens.",
  },

  {
    name: "Kandy District Secretariat",
    officeType: "District Secretariat",
    district: "Kandy",
    address:
      "District Secretariat, Kandy",
    phone: "0812222235",
    email: "",
    openingHours: "Monday - Friday, 8:30 AM - 4:15 PM",
    availableServices: [
      "Public Administration Services",
      "Land Services",
      "Social Services",
    ],
    description:
      "Provides administrative services for residents in the Kandy District.",
  },

  {
    name: "Galle District Secretariat",
    officeType: "District Secretariat",
    district: "Galle",
    address:
      "District Secretariat, Galle",
    phone: "0912234222",
    email: "",
    openingHours: "Monday - Friday, 8:30 AM - 4:15 PM",
    availableServices: [
      "Public Administration Services",
      "Land Services",
      "Social Services",
    ],
    description:
      "Provides government administrative services to residents in Galle District.",
  },

  {
    name: "Kurunegala District Secretariat",
    officeType: "District Secretariat",
    district: "Kurunegala",
    address:
      "District Secretariat, Kurunegala",
    phone: "0372222235",
    email: "",
    openingHours: "Monday - Friday, 8:30 AM - 4:15 PM",
    availableServices: [
      "Public Administration Services",
      "Land Services",
      "Social Services",
    ],
    description:
      "Provides district administrative and public services in Kurunegala.",
  },
];


const seedOffices = async () => {
  try {
    await mongoose.connect(
      process.env.MONGO_URI
    );

    console.log(
      "MongoDB connected."
    );

    await Office.deleteMany();

    console.log(
      "Existing office data removed."
    );

    await Office.insertMany(
      sampleOffices
    );

    console.log(
      "Sample GovGuide LK offices inserted successfully."
    );

    process.exit(0);
  } catch (error) {
    console.error(
      "Office database seed failed:"
    );

    console.error(error);

    process.exit(1);
  }
};


seedOffices();