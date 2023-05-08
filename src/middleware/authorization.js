const jwt = require("jsonwebtoken");
const dotenv = require("dotenv").config();

const requireAdminRole = (req, res, next) => {
  try {
    const token = req.headers.authorization;
    if (!token) {
      res.status(401).json({ error: "Token not found" });
    }
    const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
    const { role } = decodedToken.user;

    if (role !== "admin") {
      return res.status(401).json({ message: "Unauthorized user" });
    }

    req.userData = decodedToken.user;
    next();
  } catch (error) {
    return res.status(401).json({ message: "Invalid Token" });
  }
};

const operatorVerificationStatus = (req, res, next) => {
  try {
    const token = req.headers.authorization;
    if (!token) {
      res.status(401).json({ error: "Token not found" });
    }
    const decodedToken = jwt.verify(token, process.env.JWT_OPERATOR_SECRET);
    const { isverified } = decodedToken.user;

    if (isverified !== true) {
      return res.status(401).json({
        message: "You're not a verified operator, wait till you get verified",
      });
    }

    req.userData = decodedToken.user;
    next();
  } catch (error) {
    return res.status(401).json({ message: "Invalid Token" });
  }
};

const requireOperatorRole = (req, res, next) => {
  try {
    const token = req.headers.authorization;
    if (!token) {
      res.status(401).json({ error: "Token not found" });
    }
    const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
    const { role } = decodedToken.user;

    if (role !== "operator") {
      return res.status(401).json({ message: "Unauthorized user" });
    }

    req.userData = decodedToken.user;
    next();
  } catch (error) {
    return res.status(401).json({ message: "Invalid Token" });
  }
};

module.exports = {
  requireAdminRole,
  operatorVerificationStatus,
  requireOperatorRole,
};
