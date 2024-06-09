# Stage 1: Build React frontend
FROM node:20.14.0 AS build-frontend
WORKDIR /app/frontend
COPY rpi-eventhub/frontend/package*.json ./
RUN npm install
COPY rpi-eventhub/frontend ./
RUN npm run build

# Stage 2: Set up backend
FROM node:20.14.0
WORKDIR /app/backend
COPY rpi-eventhub/backend/package*.json ./
RUN npm install
COPY rpi-eventhub/backend ./

# Copy frontend build to backend's public directory
COPY --from=build-frontend /app/frontend/build /app/backend/public

# Expose the port the backend runs on
EXPOSE 5000

# Command to run the backend
CMD ["npm", "start"]
