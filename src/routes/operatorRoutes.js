const express = require("express");
const operator = express.Router();

const multer = require("multer");

const {
  operatorStates,
  operatorLgas,
  operatorRegistrationCompletion,
  operatorSelectionCreation,
} = require("../controllers/OperatorController");
const { operatorVerificationStatus } = require("../middleware/authorization");

const upload = multer({ dest: "uploads/" });

operator.post(
  "/completeregistration",

  upload.single("picture"),
  operatorRegistrationCompletion
);

operator.get("/states", operatorStates);

operator.get("/states/:state_id/lgas", operatorLgas);

operator.post(
  "/productselection",
  operatorVerificationStatus,
  operatorSelectionCreation
);

module.exports = operator;
