# Use the official Node.js image based on Alpine 22
FROM node:22-alpine

# Set the working directory inside the container
WORKDIR /app

# Copy package.json and package-lock.json to the container
COPY package.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application code to the container
COPY . .

COPY .env .env

# Build the TypeScript project
RUN npm run build

# Expose the port the app runs on
EXPOSE 3000

# Set environment variables from .env file
ENV NODE_ENV=production

# Start the application
CMD ["node", "--env-file=.env", "build/main.js"]