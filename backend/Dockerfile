# Use a secure and efficient Node.js base image
FROM node:20-slim

# Create the app directory
WORKDIR /usr/src/app

# Copy package.json and package-lock.json to install dependencies
COPY package*.json ./
RUN npm install --only=production

# Copy the rest of the application source code
COPY . .

# Cloud Run will automatically inject the PORT environment variable.
# App Engine will use the port set by the environment.
EXPOSE 5000 

# Start the server
CMD [ "node", "server.js" ]