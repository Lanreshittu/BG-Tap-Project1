/* Replace with your SQL commands */
CREATE TABLE IF NOT EXISTS states (
  state_id SERIAL PRIMARY KEY,
  state VARCHAR(255) NOT NULL UNIQUE
  )