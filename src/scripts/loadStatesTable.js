const pool = require("../config/Db");

const loadStatesTable = async () => {
  let conn;
  try {
    conn = await pool.connect();
    const checkSql = "SELECT COUNT(*) FROM states";
    const rows = await conn.query(checkSql);
    const rowCount = rows.rows[0].count;
    if (rowCount == 0) {
      const insertSql = `INSERT INTO states (state)
            VALUES 
                      ('Abia'),
                      ('Adamawa'),
                      ('Akwa Ibom'),
                      ('Anambra'),
                      ('Bauchi'),
                      ('Bayelsa'),
                      ('Benue'),
                      ('Borno'),
                      ('Cross River'),
                      ('Delta'),
                      ('Ebonyi'),
                      ('Edo'),
                      ('Ekiti'),
                      ('Enugu'),
                      ('Gombe'),
                      ('Imo'),
                      ('Jigawa'),
                      ('Kaduna'),
                      ('Kano'),
                      ('Katsina'),
                      ('Kebbi'),
                      ('Kogi'),
                      ('Kwara'),
                      ('Lagos'),
                      ('Nasarawa'),
                      ('Niger'),
                      ('Ogun'),
                      ('Ondo'),
                      ('Osun'),
                      ('Oyo'),
                      ('Plateau'),
                      ('Rivers'),
                      ('Sokoto'),
                      ('Taraba'),
                      ('Yobe'),
                      ('Zamfara'),
                      ('FCT')            
                        RETURNING *;`;
      const result = await conn.query(insertSql);
    }
  } catch (error) {
    console.log(error);
  } finally {
    conn.release();
  }
};

loadStatesTable();

module.exports = loadStatesTable;
