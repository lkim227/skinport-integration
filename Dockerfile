# Use Node.js official image
FROM node:18-alpine

WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install

# Install Knex globally for migrations
RUN npm install knex -g

# Copy the rest of the application code
COPY . .

# Ensure wait-for-it.sh is executable
RUN chmod +x wait-for-it.sh

# Expose the application port
EXPOSE 3000

# Run the wait-for-it.sh script using 'sh' and start the app
CMD ["sh", "-c", "./wait-for-it.sh db:5432 -- npx knex migrate:latest && npm run start"]
