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

RUN mkdir -p /app/backend/public
RUN cp -r dist/* /app/backend/public/

WORKDIR /app/backend

EXPOSE 5000

CMD ["npm", "start"]
