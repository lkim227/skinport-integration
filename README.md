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
2. Run the application using Docker Compose:
  ```bash
  docker-compose up --build
3. The server will be running at `http://localhost:3000`.

## Running Tests

To run the unit and e2e tests:
    ```bash
    npm run test

## API Endpoints
- POST /auth/login - Authenticate a user
- PUT /user/password - Change the user password
- GET /items - Retrieve item prices (with Redis caching)
- POST /purchase - Purchase an item (balance check)

---

### Final Notes:
- PostgreSQL and Redis are fully contained in Docker containers, and no external
