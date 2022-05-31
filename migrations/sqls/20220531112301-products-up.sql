CREATE TABLE products (
    id SERIAL PRIMARY KEY,
    name TEXT NOT NULL,
    category VARCHAR(60) NOT NULL,
    price INTEGER NOT NULL);