FROM node:22-alpine

WORKDIR /app

COPY package*.json ./

RUN npm install

RUN npm i -g serve

COPY . .

# Expose ENV variables to the build process in docker-compose.yml
ARG VITE_BACKEND_URL
ARG VITE_BACKEND_API_ROUTE

# Set ENV variables
ENV VITE_BACKEND_URL=$VITE_BACKEND_URL
ENV VITE_BACKEND_API_ROUTE=$VITE_BACKEND_API_ROUTE

RUN npm run build

EXPOSE 5173

CMD [ "serve", "-s", "dist", "-l", "5173" ]