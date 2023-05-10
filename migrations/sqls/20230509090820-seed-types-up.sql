/* Replace with your SQL commands */
CREATE TABLE IF NOT EXISTS seed_types (
  seed_type_id SERIAL PRIMARY KEY,
  seed_type VARCHAR(255) NOT NULL UNIQUE,
  product_id integer REFERENCES products(product_id) on DELETE CASCADE
  )