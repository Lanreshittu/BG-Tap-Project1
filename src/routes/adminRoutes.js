const express = require("express");
const { operatorVerification } = require("../controllers/OperatorController");
const admin = express.Router();

admin.patch("/verifyoperator/:id", operatorVerification);

module.exports = admin;
