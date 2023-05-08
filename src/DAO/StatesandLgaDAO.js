const pool = require("../config/Db");

const getStates = (req) => {
  return new Promise(async (resolve, reject) => {
    let conn;
    try {
      conn = await pool.connect();
      const statesSql = "SELECT * from states;";
      const statesresult = await conn.query(statesSql);
      const allStates = statesresult.rows;

      resolve(allStates);
    } catch (error) {
      reject(error);
    } finally {
      conn.release();
    }
  });
};

const getlgas = (req) => {
  return new Promise(async (resolve, reject) => {
    let conn;
    try {
      const { state_id } = req.params;

      conn = await pool.connect();
      const lgasSql = "SELECT lga_id,lga from lgas where state_id =($1);";
      const lgasresult = await conn.query(lgasSql, [state_id]);
      const allLgas = lgasresult.rows;

      if (!allLgas.length) {
        reject("pass in a valid state id");
      }
      resolve(allLgas);
    } catch (error) {
      reject(error);
    } finally {
      conn.release();
    }
  });
};

module.exports = { getStates, getlgas };
