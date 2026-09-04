const Service = require("./service.model");


// ======================================
// CREATE SERVICE
// ======================================

const createService = async (req, res) => {
  try {
    const {
      name,
      category,
      department,
      description,
      requiredDocuments,
      fee,
      processingTime,
      eligibility,
    } = req.body;

    if (
      !name ||
      !category ||
      !department ||
      !description ||
      fee === undefined ||
      !processingTime
    ) {
      return res.status(400).json({
        success: false,
        message: "Please complete all required fields.",
      });
    }

    const existingService = await Service.findOne({
      name: {
        $regex: `^${name}$`,
        $options: "i",
      },
    });

    if (existingService) {
      return res.status(400).json({
        success: false,
        message: "A service with this name already exists.",
      });
    }

    const service = await Service.create({
      name,
      category,
      department,
      description,
      requiredDocuments:
        Array.isArray(requiredDocuments)
          ? requiredDocuments
          : [],
      fee,
      processingTime,
      eligibility: eligibility || "General public",
    });

    res.status(201).json({
      success: true,
      message: "Service added successfully.",
      data: service,
    });
  } catch (error) {
    console.error("Create Service Error:", error);

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
      message: "Unable to add the service. Please try again.",
    });
  }
};


// ======================================
// GET ALL SERVICES
// ======================================

const getServices = async (req, res) => {
  try {
    const { search, category } = req.query;

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
          department: {
            $regex: search,
            $options: "i",
          },
        },
        {
          description: {
            $regex: search,
            $options: "i",
          },
        },
      ];
    }

    if (category && category !== "All") {
      filter.category = category;
    }

    const services = await Service.find(filter).sort({
      createdAt: -1,
    });

    res.status(200).json({
      success: true,
      count: services.length,
      data: services,
    });
  } catch (error) {
    console.error("Get Services Error:", error);

    res.status(500).json({
      success: false,
      message: "Unable to load government services.",
    });
  }
};


// ======================================
// GET SINGLE SERVICE
// ======================================

const getServiceById = async (req, res) => {
  try {
    const service = await Service.findById(req.params.id);

    if (!service) {
      return res.status(404).json({
        success: false,
        message: "Service not found.",
      });
    }

    res.status(200).json({
      success: true,
      data: service,
    });
  } catch (error) {
    console.error("Get Service Error:", error);

    res.status(500).json({
      success: false,
      message: "Unable to load the service.",
    });
  }
};


// ======================================
// UPDATE SERVICE
// ======================================

const updateService = async (req, res) => {
  try {
    const service = await Service.findById(req.params.id);

    if (!service) {
      return res.status(404).json({
        success: false,
        message: "Service not found.",
      });
    }

    const updatedService = await Service.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true,
      }
    );

    res.status(200).json({
      success: true,
      message: "Service updated successfully.",
      data: updatedService,
    });
  } catch (error) {
    console.error("Update Service Error:", error);

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
      message: "Unable to update the service.",
    });
  }
};


// ======================================
// DELETE SERVICE
// ======================================

const deleteService = async (req, res) => {
  try {
    const service = await Service.findById(req.params.id);

    if (!service) {
      return res.status(404).json({
        success: false,
        message: "Service not found.",
      });
    }

    await service.deleteOne();

    res.status(200).json({
      success: true,
      message: "Service deleted successfully.",
    });
  } catch (error) {
    console.error("Delete Service Error:", error);

    res.status(500).json({
      success: false,
      message: "Unable to delete the service.",
    });
  }
};


module.exports = {
  createService,
  getServices,
  getServiceById,
  updateService,
  deleteService,
};