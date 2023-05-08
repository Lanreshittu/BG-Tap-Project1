const express = require("express");
const { userSignUp, userLogin } = require("../controllers/userController");
const user = express.Router();

user.post("/signup", userSignUp);
user.post("/login", userLogin);

module.exports = user;
