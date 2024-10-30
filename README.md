Here’s an updated `README` reflecting the migration information:

```markdown
# Datalouna Test Task

This project demonstrates a web server built with TypeScript, PostgreSQL, Redis, and Docker for handling user authentication, item retrieval, and purchases.

## Features

- User authentication (JWT)
- Password change
- Item retrieval with price caching (via Redis)
- Purchases with balance checks

## Prerequisites

- Docker
- Docker Compose

## Running the Project

1. Clone the repository:

   ```bash
   git clone https://github.com/yourusername/datalouna-test-task.git
   ```

2. Run the application using Docker Compose, which will build the necessary containers and apply database migrations:

   ```bash
   npm install
   docker-compose up --build
   ```

   > **Note:** Migrations are handled automatically by the `migrate` container, which will run `knex migrate:latest` to apply the latest database schema changes to PostgreSQL. This includes creating the `users`, `items`, and `purchases` tables if they do not already exist.

3. The server will be running at `http://localhost:3000`.

## Running Migrations Separately

If you need to re-run migrations manually, use the following command:

   ```bash
   docker-compose run migrate npx knex migrate:latest
   ```

This will apply the latest migrations to ensure the database schema is up to date.

## Running Tests

To run the unit test:
   ```bash
   docker-compose exec app npm run test:unit
   ```

To run the e2e test:
   ```bash
   docker-compose exec app npm run test:e2e
   ```

## API Endpoints

- `POST /auth/login` - Authenticate a user
- `PUT /user/password` - Change the user password
- `GET /items` - Retrieve item prices (with Redis caching)
- `POST /purchase` - Purchase an item (balance check)

---

### Final Notes:

- PostgreSQL and Redis are fully contained in Docker containers, requiring no external setup.
- Ensure migrations are applied as described above to avoid database-related errors during testing or runtime.
``` 

This update clarifies migration handling and manual steps for applying migrations, providing additional guidance on database setup within Docker.