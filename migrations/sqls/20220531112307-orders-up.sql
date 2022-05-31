CREATE TABLE orders (
    id SERIAL PRIMARY KEY NOT NULL,
    status VARCHAR(64),
    user_id REFERENCES users(id)
);