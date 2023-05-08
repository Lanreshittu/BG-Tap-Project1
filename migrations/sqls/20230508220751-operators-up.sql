/* Replace with your SQL commands */
-- CREATE FUNCTION concat_names(firstname VARCHAR(255), lastname VARCHAR(255))
--   RETURNS VARCHAR(255)
--   IMMUTABLE
-- AS $$
--   SELECT firstname || ' ' || lastname;
-- $$ LANGUAGE SQL;

-- CREATE FUNCTION generate_operator_id(id INTEGER)
--   RETURNS VARCHAR(255)
--   IMMUTABLE
-- AS $$
--   SELECT CONCAT('000-', id);
-- $$ LANGUAGE SQL;

-- CREATE TYPE gender AS ENUM ('male', 'female');

CREATE TABLE IF NOT EXISTS operators(
  id SERIAL PRIMARY KEY,
  operator_id VARCHAR(255) GENERATED ALWAYS AS (generate_operator_id(id)) STORED UNIQUE,
  firstname VARCHAR(255) Not Null,
  lastname VARCHAR(255) NOT NULL,
  fullname VARCHAR(255) GENERATED ALWAYS AS (concat_names(firstname, lastname)) STORED,
  phonenumber BIGINT,
  nationality VARCHAR(255) CHECK (nationality = 'nigerian'),
  state_id INTEGER  NOT NULL REFERENCES states(state_id) ON DELETE CASCADE,
  lga_id INTEGER  NOT NULL REFERENCES lgas(lga_id)ON DELETE CASCADE,
  sex gender,
  dateofbirth DATE,
  nin BIGINT,
  picture BYTEA,
  user_id INTEGER UNIQUE NOT NULL REFERENCES users(user_id)ON DELETE CASCADE,
 isverified BOOLEAN  not null DEFAULT false
 
);
