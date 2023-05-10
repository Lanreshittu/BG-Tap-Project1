/* Replace with your SQL commands */
CREATE TABLE IF NOT EXISTS products (
  product_id SERIAL PRIMARY KEY,
  product VARCHAR(255) NOT NULL UNIQUE
  )