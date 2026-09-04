const express = require("express");

const {
  createService,
  getServices,
  getServiceById,
  updateService,
  deleteService,
} = require("./service.controller");

const router = express.Router();

router.get("/", getServices);

router.get("/:id", getServiceById);

router.post("/", createService);

router.put("/:id", updateService);

router.delete("/:id", deleteService);

module.exports = router;