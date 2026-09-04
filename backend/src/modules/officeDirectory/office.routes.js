const express = require("express");

const {
  createOffice,
  getOffices,
  getOfficeById,
  updateOffice,
  deleteOffice,
} = require("./office.controller");

const router = express.Router();

router.get("/", getOffices);

router.get("/:id", getOfficeById);

router.post("/", createOffice);

router.put("/:id", updateOffice);

router.delete("/:id", deleteOffice);

module.exports = router;