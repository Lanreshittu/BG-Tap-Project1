const pool = require("../config/Db");
const bcrypt = require("bcrypt");
const dotenv = require("dotenv").config();
const jwt = require("jsonwebtoken");

const { getUserIdFromToken } = require("../utils/Token");
const fs = require("fs");
const { validateOperatorData } = require("../services/OperatorServices");

const verifyOperator = (req) => {
  return new Promise(async (resolve, reject) => {
    try {
      const { isverified } = req.body;
      const { opeartor_regid } = req.params;

      const conn = await pool.connect();
      const sqlCheck = "SELECT * from operators where opeartor_regid =($1);";
      const resultCheck = await conn.query(sqlCheck, [opeartor_regid]);
      const rowsCheck = resultCheck.rows[0];
      if (!rowsCheck) {
        reject("No operator with this ID");
      }
      if (typeof isverified != "boolean") {
        reject(
          "isverified status must be set to boolean true/false and not a string"
        );
      } else {
        const sql =
          "UPDATE operators SET isverified = ($1) WHERE opeartor_regid = ($2) RETURNING *;";
        const result = await conn.query(sql, [isverified, opeartor_regid]);
        const rows = result.rows[0];

        conn.release();
        resolve(rows);
      }
    } catch (error) {
      reject(error);
    }
  });
};

const completeOperatorRegistration = (req) => {
  return new Promise(async (resolve, reject) => {
    let conn;
    try {
      const user_id = await getUserIdFromToken(req);
      const {
        firstname,
        lastname,
        phonenumber,
        nationality,
        state_id,
        lga_id,
        sex,
        dateofbirth,
        nin,
      } = req.body;
      const picture = fs.readFileSync(req.file.path);
      await validateOperatorData(req);
      conn = await pool.connect();

      const checkSql = "select * from operators where user_id = ($1)";

      const checkResult = await conn.query(checkSql, [user_id]);
      const operator = checkResult.rows[0];

      if (!operator) {
        const sql = `INSERT INTO operators(
                  firstname,lastname, phonenumber, nationality, state_id, lga_id, sex, dateofbirth, nin, picture, user_id)
                  VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
                      RETURNING *;`;

        const values = [
          firstname,
          lastname,
          phonenumber,
          nationality,
          state_id,
          lga_id,
          sex,
          dateofbirth,
          nin,
          picture,
          user_id,
        ];
        const newPicturePath = `uploads/user${user_id}.png`;

        fs.unlinkSync(req.file.path);
        fs.writeFileSync(newPicturePath, picture);

        const result = await conn.query(sql, values);

        resolve("profile has been successfully created");
      } else {
        reject("Operator profile has already been completed for this user");
      }
    } catch (error) {
      reject(error);
    } finally {
      if (conn) {
        conn.release();
      }
    }
  });
};

const createOperatorChoice = (req) => {
  return new Promise(async (resolve, reject) => {
    try {
      const opeartor_regid = await getOperatorRegIdFromToken(req);
      const { product_id, seed_type_id } = req.body;

      const conn = await pool.connect();

      // Get the operator_id
      const productSql =
        "SELECT operator_id FROM operatorsprofile WHERE opeartor_regid = ($1)";

      const operatorResult = await conn.query(productSql, [opeartor_regid]);
      const operator_id = operatorResult.rows[0].operator_id;

      await validateOperatorChoice(req, operator_id);

      ////////
      const sql = `INSERT INTO operators_choice(
                operator_id, product_id, seed_type_id)
                VALUES ($1, $2, $3)
                    RETURNING *;`;

      const values = [operator_id, product_id, seed_type_id];

      const result = await conn.query(sql, values);
      const operatorChoice = result.rows[0];

      conn.release();

      resolve(operatorChoice);
    } catch (error) {
      reject(error);
    }
  });
};

module.exports = {
  verifyOperator,
  completeOperatorRegistration,
  createOperatorChoice,
};
