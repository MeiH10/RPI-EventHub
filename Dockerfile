# Use the official Node.js image
FROM node:18-alpine

# Set the working directory for backend
WORKDIR /app/backend

# Copy the backend package.json and package-lock.json
COPY rpi-eventhub/backend/package*.json ./

# Install backend dependencies
RUN npm install

# Copy the backend application code
COPY rpi-eventhub/backend .

# Set the working directory for frontend build
WORKDIR /app/frontend

# Copy the frontend package.json and package-lock.json
COPY rpi-eventhub/frontend/package*.json ./

# Install frontend dependencies
RUN npm install

# Copy the frontend application code
COPY rpi-eventhub/frontend .

# Build the frontend
RUN npm run build

# Move the frontend build to the backend public directory
RUN mv build ../backend/public

# Set the working directory back to the backend
WORKDIR /app/backend

# Expose the port your app runs on
EXPOSE 5000

# Command to run the backend application
CMD ["node", "index.js"]
