const jwt = require("jsonwebtoken");
const pool = require("../config/Db");
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

const operatorVerificationStatus = async (req, res, next) => {
  let conn;
  try {
    const token = req.headers.authorization;
    if (!token) {
      res.status(401).json({ error: "Token not found" });
    }
    const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
    const user_id = decodedToken.user.id;

    // Get the isverified status
    conn = await pool.connect();
    const sql = "SELECT isverified FROM operators WHERE user_id = ($1)";

    const result = await conn.query(sql, [user_id]);
    const isverified = result.rows[0].isverified;

    if (!isverified) {
      return res.status(401).json({
        message: "You're not a verified operator, wait till you get verified",
      });
    }

    req.userData = decodedToken.user;
    next();
  } catch (error) {
    return res.status(401).json({ message: "Invalid Token" });
  } finally {
    if (conn) {
      conn.release();
    }
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
