# Use Node.js official image
FROM node:18-alpine

# Set the working directory inside the container
WORKDIR /app

# Copy the package.json and package-lock.json to the container
COPY package*.json ./

# Install dependencies inside the container
RUN npm Install

# Install TypeScript globally
RUN npm install -g TypeScript

# Copy the rest of the application code
COPY . .

# Complete the TypeScript code to JavaScript
RUN npm run build

# Expose the application port
EXPOSE 3000

# Start the application
CMD ["npm", "run", "start"]
