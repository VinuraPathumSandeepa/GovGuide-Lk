const express =
  require("express");

const {
  getRecommendations,
} = require(
  "./finder.controller"
);


const router =
  express.Router();


router.post(
  "/recommend",
  getRecommendations
);


module.exports =
  router;