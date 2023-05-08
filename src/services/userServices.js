const pool = require("../config/Db");
const validator = require("validator");
const { expectedKeysChecker } = require("../utils/validations.js");

//  Description
//  Check that the email provided doesn't exist already

const checkDuplicateEmail = (req) => {
  return new Promise(async (resolve, reject) => {
    let conn;
    try {
      const { email } = req.body;

      conn = await pool.connect();
      const sql = "SELECT email from users;";
      const result = await conn.query(sql);
      const rows = result.rows;

      const check = rows.find((user) => {
        return user.email.trim() === email.trim();
      });

      resolve(check);
    } catch (error) {
      reject(error);
    } finally {
      conn.release();
    }
  });
};

const validateRole = (role) => {
  return new Promise(async (resolve, reject) => {
    let conn;
    try {
      conn = await pool.connect();
      const roleSql = "SELECT * from roles where role =($1);";
      const roleResult = await conn.query(roleSql, [role.toLowerCase()]);
      const userRole = roleResult.rows;
      if (!userRole.length) {
        reject("please provide a valid role");
      }
      resolve("empty");
    } catch (error) {
      reject(error);
    } finally {
      conn.release();
    }
  });
};

const validateUserData = (req) => {
  return new Promise(async (resolve, reject) => {
    try {
      const { email, password, role } = req.body;

      const requiredKeys = ["email", "password", "role"];

      await expectedKeysChecker(req, requiredKeys);

      if (!role || !email || !password) {
        reject("email,password, and  role must be provided");
      } else if (
        email.trim() === "" ||
        password.trim() === "" ||
        role.trim() === ""
      ) {
        reject("email, password or role cannot be blank");
      } else if (!validator.isEmail(email)) {
        reject("provide a valid email");
      } else if (await checkDuplicateEmail(req)) {
        reject("Email already exists");
      } else {
        await validateRole(role.toLowerCase().trim());
      }
      resolve(true);
    } catch (error) {
      reject(error);
    }
  });
};

module.exports = { validateUserData };
