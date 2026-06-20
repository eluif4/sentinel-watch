# Import node:22-alpine
FROM node:22-alpine

# Set the working directory
WORKDIR /app

# Copy the package.json and package-lock.json files
COPY package*.json ./

# Install the dependencies
RUN npm install

# Copy the rest of the application
COPY . .

# Import ENV variables
# There is no need to import ENV variables in the DockerFile
# ENV variables are imported from the docker-compose.yml

# Build the application
RUN npm run build

# Start the application
CMD ["npm", "run", "start:prod"]