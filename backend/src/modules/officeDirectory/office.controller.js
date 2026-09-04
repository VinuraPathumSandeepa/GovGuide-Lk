const Office = require("./office.model");


// ======================================
// CREATE OFFICE
// ======================================

const createOffice = async (req, res) => {
  try {
    const {
      name,
      officeType,
      district,
      address,
      phone,
      email,
      openingHours,
      availableServices,
      description,
    } = req.body;

    if (
      !name ||
      !officeType ||
      !district ||
      !address ||
      !phone ||
      !openingHours
    ) {
      return res.status(400).json({
        success: false,
        message: "Please complete all required office fields.",
      });
    }

    const existingOffice = await Office.findOne({
      name: {
        $regex: `^${name}$`,
        $options: "i",
      },
      district: {
        $regex: `^${district}$`,
        $options: "i",
      },
    });

    if (existingOffice) {
      return res.status(400).json({
        success: false,
        message:
          "An office with this name already exists in this district.",
      });
    }

    const office = await Office.create({
      name,
      officeType,
      district,
      address,
      phone,
      email: email || "",
      openingHours,
      availableServices: Array.isArray(availableServices)
        ? availableServices
        : [],
      description: description || "",
    });

    res.status(201).json({
      success: true,
      message: "Office added successfully.",
      data: office,
    });
  } catch (error) {
    console.error("Create Office Error:", error);

    if (error.name === "ValidationError") {
      const messages = Object.values(error.errors).map(
        (item) => item.message
      );

      return res.status(400).json({
        success: false,
        message: messages[0],
      });
    }

    res.status(500).json({
      success: false,
      message: "Unable to add the office. Please try again.",
    });
  }
};


// ======================================
// GET ALL OFFICES
// ======================================

const getOffices = async (req, res) => {
  try {
    const { search, district } = req.query;

    const filter = {};

    if (search) {
      filter.$or = [
        {
          name: {
            $regex: search,
            $options: "i",
          },
        },
        {
          officeType: {
            $regex: search,
            $options: "i",
          },
        },
        {
          address: {
            $regex: search,
            $options: "i",
          },
        },
        {
          availableServices: {
            $elemMatch: {
              $regex: search,
              $options: "i",
            },
          },
        },
      ];
    }

    if (district && district !== "All") {
      filter.district = district;
    }

    const offices = await Office.find(filter).sort({
      createdAt: -1,
    });

    res.status(200).json({
      success: true,
      count: offices.length,
      data: offices,
    });
  } catch (error) {
    console.error("Get Offices Error:", error);

    res.status(500).json({
      success: false,
      message: "Unable to load offices.",
    });
  }
};


// ======================================
// GET SINGLE OFFICE
// ======================================

const getOfficeById = async (req, res) => {
  try {
    const office = await Office.findById(req.params.id);

    if (!office) {
      return res.status(404).json({
        success: false,
        message: "Office not found.",
      });
    }

    res.status(200).json({
      success: true,
      data: office,
    });
  } catch (error) {
    console.error("Get Office Error:", error);

    res.status(500).json({
      success: false,
      message: "Unable to load the office.",
    });
  }
};


// ======================================
// UPDATE OFFICE
// ======================================

const updateOffice = async (req, res) => {
  try {
    const office = await Office.findById(req.params.id);

    if (!office) {
      return res.status(404).json({
        success: false,
        message: "Office not found.",
      });
    }

    const updatedOffice = await Office.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true,
      }
    );

    res.status(200).json({
      success: true,
      message: "Office updated successfully.",
      data: updatedOffice,
    });
  } catch (error) {
    console.error("Update Office Error:", error);

    if (error.name === "ValidationError") {
      const messages = Object.values(error.errors).map(
        (item) => item.message
      );

      return res.status(400).json({
        success: false,
        message: messages[0],
      });
    }

    res.status(500).json({
      success: false,
      message: "Unable to update the office.",
    });
  }
};


// ======================================
// DELETE OFFICE
// ======================================

const deleteOffice = async (req, res) => {
  try {
    const office = await Office.findById(req.params.id);

    if (!office) {
      return res.status(404).json({
        success: false,
        message: "Office not found.",
      });
    }

    await office.deleteOne();

    res.status(200).json({
      success: true,
      message: "Office deleted successfully.",
    });
  } catch (error) {
    console.error("Delete Office Error:", error);

    res.status(500).json({
      success: false,
      message: "Unable to delete the office.",
    });
  }
};


module.exports = {
  createOffice,
  getOffices,
  getOfficeById,
  updateOffice,
  deleteOffice,
};