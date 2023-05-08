const express = require("express");
const operator = express.Router();

const multer = require("multer");

const {
  operatorStates,
  operatorLgas,
  operatorRegistrationCompletion,
} = require("../controllers/OperatorController");
const { requireOperatorRole } = require("../middleware/authorization");

const upload = multer({ dest: "uploads/" });

operator.post(
  "/completeregistration",
  requireOperatorRole,
  upload.single("picture"),
  operatorRegistrationCompletion
);

operator.get("/states", operatorStates);

operator.get("/states/:state_id/lgas", operatorLgas);

// operator.post(
//   "/productselection",
//   operatorVerificationStatus,
//   operatorChoiceCreation
// );

module.exports = operator;
