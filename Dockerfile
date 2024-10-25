# Use Node.js official image
FROM node:18-alpine

WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install

# Install Knex globally for migrations
RUN npm install -g typescript knex

# Copy the rest of the application code
COPY . .

# Compile TypeScript files
RUN npm run build

# Expose the application port
EXPOSE 3000

# Start the app (migrations are handled in a separate Docker service)
CMD ["npm", "run", "start"]
