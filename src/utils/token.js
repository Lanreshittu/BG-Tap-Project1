const dotenv = require("dotenv").config();
const jwt = require("jsonwebtoken");

const getUserIdFromToken = (req) => {
  return new Promise((resolve, reject) => {
    try {
      const token = req.headers.authorization;
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      const user_id = decoded.user.id;

      resolve(user_id);
    } catch (error) {
      reject(error);
    }
  });
};

module.exports = { getUserIdFromToken };
