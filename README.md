# Storefront Backend Project

## Getting Started

This is an example API for a E-commerce website

## Used Technologies

- Postgres for the database
- Node/Express for the application logic
- dotenv from npm for managing environment variables
- db-migrate from npm for migrations
- jsonwebtoken from npm for working with JWTs
- jasmine from npm for testing

## Setting up the Project

- [Download](postgresql.org/download/) and Install PostgresSQL database and follow the steps in the [guide](https://www.postgresqltutorial.com/postgresql-getting-started/install-postgresql/).
- The application is preconfigured to run with a PostgresSQL DB with the following settings:
  - Host: localhost
  - Port: 5432
- Install node dependencies using `npm i`
- Create a .env file following the example in .envexample file.
- Create the databases for development and testing:

  - Open the psql command-line tool:

  - In the Windows Command Prompt, run the command:
    - psql -U userName
    - Enter your password when prompted.
  - `CREATE DATABASE storefront_db WITH ENCODING 'UTF8'`;
  - `CREATE DATABASE test_db WITH ENCODING 'UTF8'`;
  - Connect to the database using `\c databaseName`

- Install db-migrate globally using `npm i db-migrate -g` to run the migrations.
- Run `db-migrate up` to create the database tables.
- Run the script `npm run watch` to start the application

## Scripts

- `npm run watch` to start the server.
- `npm run test` to start the tests.
- `npm run prettier` to run prettier.
- `npm run lint` to run ESlint.

## Endpoints

| HTTP VERB | PATH                                                 | USED FOR                        |
| --------- | ---------------------------------------------------- | ------------------------------- |
| POST      | localhost:3000/authenticate                          | authenticate/login              |
| GET       | localhost:3000/users                                 | index[token required]           |
| POST      | localhost:3000/users                                 | create                          |
| GET       | localhost:3000/users/:id                             | show [token required]           |
| DELETE    | localhost:3000/users/:id                             | delete [token required]         |
| GET       | localhost:3000/products                              | index                           |
| POST      | localhost:3000/products                              | create [token required]         |
| GET       | localhost:3000/products/:id                          | show                            |
| GET       | localhost:3000/products-category?category={category} | filterByCategory                |
| GET       | localhost:3000/products/top                          | topProducts                     |
| GET       | localhost:3000/orders                                | index [token required]          |
| POST      | localhost:3000/orders                                | create [token required]         |
| GET       | localhost:3000/orders/:id                            | show [token required]           |
| DELETE    | localhost:3000/orders/:id                            | delete [token required]         |
| GET       | localhost:3000/orders/user/:user_id                  | orderByUser [token required]    |
| GET       | localhost:3000/orders/complete/:user_id              | completeOrders [token required] |
| POST      | localhost:3000/orders/addProduct                     | addProduct [token required]     |
| PATCH     | localhost:3000/orders/orders/update                  | updateStatus [token required]   |
