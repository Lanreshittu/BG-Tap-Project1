const pool = require("../config/Db");
const validator = require("validator");

const { expectedKeysChecker } = require("../utils/validations");

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// operator complete-registratation validations

// Validate user country

const operatorNationality = async (req) => {
  return new Promise((resolve, reject) => {
    try {
      let { nationality } = req.body;
      nationality = nationality.toLowerCase().trim();
      if (nationality !== "nigerian") {
        reject("We're sorry, Operator must be a Nigerian");
      }
      resolve(true);
    } catch (error) {
      reject(error);
    }
  });
};

const operatorStateAndLga = (lga_id, state_id) => {
  return new Promise(async (resolve, reject) => {
    let conn;
    try {
      conn = await pool.connect();
      const lgasSql = "SELECT * from lgas where state_id =($1);";
      const lgasresult = await conn.query(lgasSql, [state_id]);
      const allLgas = lgasresult.rows;
      if (!allLgas.length) {
        reject("please provide a valid state ID from range 1-37 states");
      }

      const sql = "SELECT * from lgas where state_id =($1) and lga_id = ($2);";
      const result = await conn.query(sql, [state_id, lga_id]);
      const lga = result.rows[0];

      if (!lga) {
        reject({
          "Invalid Lga_id for state_id provided. Valid Lga id Include": allLgas,
        });
      } else {
        resolve("empty");
      }
    } catch (error) {
      reject(error);
    } finally {
      conn.release();
    }
  });
};

const operatorNin = (nin) => {
  return new Promise(async (resolve, reject) => {
    let conn;
    try {
      conn = await pool.connect();

      const foundNINQuery = "SELECT * FROM operators WHERE nin = $1";
      const foundNINResult = await conn.query(foundNINQuery, [nin]);
      const foundNIN = foundNINResult.rows[0];
      if (foundNIN) {
        reject("This Nin already belongs to a registered user");
      } else {
        resolve(true);
      }
    } catch (error) {
      reject(error);
    } finally {
      conn.release();
    }
  });
};

const validateOperatorData = (req) => {
  return new Promise(async (resolve, reject) => {
    let conn;
    try {
      const allowedImageMimeTypes = [
        "image/jpeg",
        "image/png",
        "image/gif",
        "image/jpg",
      ];

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

      const requiredKeys = [
        "firstname",
        "lastname",
        "phonenumber",
        "nationality",
        "state_id",
        "lga_id",
        "sex",
        "dateofbirth",
        "nin",
        "picture",
      ];

      await expectedKeysChecker(req, requiredKeys);

      const phonePattern = /^((\+234)|234|0)[78901]\d{9}$/;
      const ninPattern = /^(?!0{11})\d{11}$/;

      if (
        !firstname ||
        !lastname ||
        !phonenumber ||
        !nationality ||
        !state_id ||
        !lga_id ||
        !sex ||
        !dateofbirth ||
        !nin
      ) {
        reject(
          "firstname, lastname, phonenumber, nationality, state_id, lga_id, sex, dateofbirth, nin and picture must be provided"
        );
      } else if (
        !(
          firstname.trim() &&
          lastname.trim() &&
          phonenumber.trim() &&
          nationality.trim() &&
          state_id.trim() &&
          lga_id.trim() &&
          sex.trim() &&
          dateofbirth.trim() &&
          nin.trim()
        )
      ) {
        reject(
          "firstname, lastname, phonenumber, nationality, state_id, lga_id, sex, dateofbirth, nin and picture must be not be blank"
        );
      } else if (!req.file) {
        reject("Upload a Picture");
      } else if (!allowedImageMimeTypes.includes(req.file.mimetype)) {
        reject("Upload an image as picture");
      } else {
        if (!phonePattern.test(phonenumber))
          reject("Put in a valid phone number");
        await operatorNationality(req);
        if (!validator.isInt(state_id))
          reject("Invalid State_id. Integer expected");
        if (!validator.isInt(lga_id))
          reject("Invalid Lga_id. Integer expected");
        await operatorStateAndLga(lga_id, state_id);
        if (!validator.isIn(sex.toLowerCase(), ["male", "female"]))
          reject("Invalid Sex. Only 'male' and 'female' are allowed");
        if (!validator.isDate(dateofbirth))
          reject("Invalid Date of birth. Use format yyyy-mm-dd");
        if (!ninPattern.test(nin)) reject("Put in a Valid NIN");
        await operatorNin(nin);
      }

      resolve(true);
    } catch (error) {
      reject(error);
    } finally {
      if (conn) {
        conn.release();
      }
    }
  });
};
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//validation for operator's Selection data

const checkCorrectProductAndSeedTypeId = (
  operator_id,
  product_id,
  seed_type_id
) => {
  return new Promise(async (resolve, reject) => {
    let conn;
    try {
      conn = await pool.connect();
      const productSql = "SELECT * from products ;";
      const productresult = await conn.query(productSql);
      const allProduct = productresult.rows;

      const allSeedTypeSql = "SELECT * from seed_types where product_id=($1);";
      const allSeedTypeResult = await conn.query(allSeedTypeSql, [product_id]);
      const allSeedTypes = allSeedTypeResult.rows;

      if (!allSeedTypes.length)
        reject({
          "Invalid Product_id provided. select a valid product_id from this list of products;":
            allProduct,
        });

      const seedTypeSql =
        "SELECT * from seed_types where seed_type_id =($1) and product_id=($2);";
      const seedTypeResult = await conn.query(seedTypeSql, [
        seed_type_id,
        product_id,
      ]);
      const seedType = seedTypeResult.rows[0];
      if (!seedType)
        reject({
          "Invalid Seed Type_id for product_id provided. Valid Seed_type_id Include:":
            allSeedTypes,
        });

      const sql =
        "SELECT * from operators_selections where operator_id =($1) and seed_type_id =($2) and product_id=($3)";
      const result = await conn.query(sql, [
        operator_id,
        seed_type_id,
        product_id,
      ]);
      const operatorSelection = result.rows[0];
      if (operatorSelection) reject("Operator already has this selection");

      resolve(true);
    } catch (error) {
      reject(error);
    } finally {
      conn.release();
    }
  });
};

const validateOperatorSelection = (req, operator_id) => {
  return new Promise(async (resolve, reject) => {
    try {
      const { product_id, seed_type_id } = req.body;

      const requiredKeys = ["product_id", "seed_type_id"];
      await expectedKeysChecker(req, requiredKeys);

      if (!product_id || !seed_type_id) {
        reject("Product_id and seed_type_id must be provided");
      } else {
        if (!validator.isInt(String(product_id)))
          reject("Invalid Product id. Product_id must be a number");
        if (!validator.isInt(String(seed_type_id)))
          reject("Invalid Seed type id. seed_id must be a number");
        await checkCorrectProductAndSeedTypeId(
          operator_id,
          product_id,
          seed_type_id
        );
      }
      resolve(true);
    } catch (error) {
      reject(error);
    }
  });
};

module.exports = {
  validateOperatorData,
  validateOperatorSelection,
};
