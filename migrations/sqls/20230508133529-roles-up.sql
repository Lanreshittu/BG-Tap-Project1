/* Replace with your SQL commands */
CREATE TABLE IF NOT EXISTS roles (
  role_id SERIAL PRIMARY KEY,
  role VARCHAR(255) NOT NULL UNIQUE
  )