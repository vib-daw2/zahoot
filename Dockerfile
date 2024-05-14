# Use the official Node.js 14 image as the base image
FROM node:20-alpine

# Set the working directory inside the container
WORKDIR /app

# Copy the package.json and package-lock.json files to the working directory
COPY backend/package*.json ./

# Install the dependencies
RUN npm install

# Copy the rest of the application code to the working directory
COPY backend/ ./

# Expose the port on which the application will run
EXPOSE 3000

# Start the application
CMD ["npm", "start"]
