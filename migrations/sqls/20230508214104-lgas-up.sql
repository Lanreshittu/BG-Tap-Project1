/* Replace with your SQL commands */
CREATE TABLE IF NOT EXISTS lgas (
  lga_id SERIAL PRIMARY KEY,
  lga VARCHAR(255) NOT NULL,
  state_id INTEGER REFERENCES states (state_id) ON DELETE CASCADE
  )