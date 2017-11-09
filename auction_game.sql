DROP DATABASE IF EXISTS auction_game;
CREATE DATABASE auction_game;

\c auction_game;

CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  balance int NOT NULL,
  username VARCHAR
);

INSERT INTO users (username, balance)
  VALUES ('Seyi', 1000);

CREATE TABLE inventories (
  user_id int NOT NULL,
  bread int NOT NULL,
  carrot int NOT NULL,
  diamond int NOT NULL,
  PRIMARY KEY (user_id),
  CONSTRAINT fk_user_id FOREIGN KEY (user_id) REFERENCES users (id)
);

INSERT INTO inventories (user_id, bread, carrot, diamond)
  VALUES (1, 30, 18, 1);