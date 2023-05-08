/* Replace with your SQL commands */
CREATE TABLE IF NOT EXISTS users (
  user_id SERIAL PRIMARY KEY,
  email varchar(255) NOT NULL UNIQUE,
  password varchar(255) NOT NULL,
  role varchar(255) NOT NULL REFERENCES roles(role)ON DELETE CASCADE
);
