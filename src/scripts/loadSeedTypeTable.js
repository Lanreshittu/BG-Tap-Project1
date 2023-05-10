const pool = require("../config/Db");

const loadSeedTypesTable = async () => {
  let conn;
  try {
    conn = await pool.connect();
    const checkSql = "SELECT COUNT(*) FROM seed_types";
    const rows = await conn.query(checkSql);
    const rowCount = rows.rows[0].count;
    if (rowCount == 0) {
      const insertSql = `INSERT INTO seed_types (seed_type,product_id)
            VALUES 
            ('rice Seed Type A',1),
            ('rice Seed Type B',1),
            ('rice Seed Type C',1),
            ('rice Seed Type D',1),
            ('maize Seed Type A',2),
            ('maize Seed Type B',2),
            ('maize Seed Type C',2),         
            ('maize Seed Type D',2)         
            RETURNING *;`;
      const result = await conn.query(insertSql);
      console.log("Seed Types Table loaded successfully");
    }
    console.log("Seed Types Table Already loaded");
  } catch (error) {
    console.log(error);
  } finally {
    conn.release();
  }
};

loadSeedTypesTable();
module.exports = loadSeedTypesTable;
