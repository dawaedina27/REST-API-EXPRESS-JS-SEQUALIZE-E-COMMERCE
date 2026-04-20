# Express Assignment API

E-commerce REST API built with Express.js and Sequelize.

## Features

- Versioned API routes under `/api/v1`
- Resources: products, orders, users, categories, carts, cart-items, payments, inventory, shipments, reviews, returns
- Swagger docs at `/api-docs` and `/api-docs.json`
- Middleware: request logger, JSON content-type guard, 404 handler, centralized error handler
- Automated checks with CI (lint, format-check, tests, BDD, unit tests, coverage, swagger validation)

## Tech Stack

- Node.js + Express
- Sequelize + MySQL
- Swagger UI Express
- ESLint + Prettier
- Cucumber (BDD)
- Supertest

## Getting Started

### 1. Install dependencies

```bash
npm install
```

### 2. Configure environment

Copy `.env.example` to `.env` and update values:

```env
PORT=5000
NODE_ENV=development
API_VERSION=v1
DB_HOST=localhost
DB_DIALECT=mysql
DB_NAME=express_assignment_db
DB_USER=root
DB_PASSWORD=db_password_here
```

### 3. Run the API

```bash
npm run dev
```

or

```bash
npm start
```

## API Documentation

- Swagger UI: `http://localhost:5000/api-docs`
- OpenAPI JSON: `http://localhost:5000/api-docs.json`

## Authentication

JWT authentication is available under:

- `POST /api/v1/auth/register`
- `POST /api/v1/auth/login`

Use the returned token as:

```http
Authorization: Bearer <token>
```

Protected endpoints include orders, carts, cart-items, payments, inventory, shipments, reviews, and returns.
`inventory` additionally requires `ADMIN` role.

## Testing and Quality

### Main scripts

- `npm run lint` - ESLint checks
- `npm run format:check` - Prettier check mode
- `npm run format` - auto-format files
- `npm test` - integration-style API test script
- `npm run coverage` - coverage report for `npm test`
- `npm run swagger:validate` - validate `docs/swagger.json`

### BDD

- `npm run test:bdd`

Feature files live in:

- `features/*.feature`
- `features/step_definitions/*.js`

### TDD / Unit Tests

- `npm run test:unit` - run unit tests
- `npm run test:tdd` - watch mode for red/green/refactor loop

Unit tests live in:

- `test/unit/run-unit-tests.js`

## CI Jobs

The GitHub Actions workflow includes:

- `format-check`
- `lint`
- `test`
- `unit-test`
- `bdd`
- `coverage`
- `swagger-validate`
- `validate` (JavaScript syntax validation)

## Project Structure

```text
config/
controllers/
docs/
features/
middleware/
models/
routes/
test/
```

## Notes

- API versioning is controlled by `API_VERSION` in `.env` (default: `v1`).
- Sequelize sync currently uses `alter: true` in `app.js`.
