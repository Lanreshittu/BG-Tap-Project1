const pool = require("../config/Db");

const loadRolesTable = async () => {
  let conn;
  try {
    conn = await pool.connect();
    const checkSql = "SELECT COUNT(*) FROM roles";
    const rows = await conn.query(checkSql);
    const rowCount = rows.rows[0].count;
    if (rowCount == 0) {
      const insertSql = `INSERT INTO roles (role)
            VALUES 
                      ('admin'),
                      ('operator'),           
                      ('field officer')           
                      RETURNING *;`;
      const result = await conn.query(insertSql);
      console.log("Roles Table loaded successfully");
    }
    console.log("Roles Table Already loaded");
  } catch (error) {
    console.log(error);
  } finally {
    conn.release();
  }
};

loadRolesTable();

module.exports = loadRolesTable;
