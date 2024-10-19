FROM node:20

RUN npm install -g pm2

WORKDIR /app

COPY rpi-eventhub/backend /app/backend
COPY rpi-eventhub/frontend /app/frontend

WORKDIR /app/backend
RUN npm install

WORKDIR /app/frontend
RUN npm install
RUN npm run build

RUN mkdir -p /app/backend/public
RUN cp -r dist/* /app/backend/public/

WORKDIR /app/backend

EXPOSE 5000

COPY pm2.config.js /app/backend/pm2.config.js

CMD ["pm2-runtime", "pm2.config.js"]
