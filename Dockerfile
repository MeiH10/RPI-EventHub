# Use Node.js as the base image
FROM node:20

WORKDIR /app

COPY rpi-eventhub/backend /app/backend
COPY rpi-eventhub/frontend /app/frontend

WORKDIR /app/backend

RUN npm install

# Build frontend
WORKDIR /app/frontend
RUN npm install
RUN npm run build

# Move the build to the backend public directory
RUN mkdir -p /app/backend/public
RUN cp -r build/* /app/backend/public/

WORKDIR /app/backend

EXPOSE 5000

CMD ["npm", "start"]