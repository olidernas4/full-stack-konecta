# Dockerfile for backend

# Use the official Node.js image
FROM node:18

# Set the working directory
WORKDIR /usr/src/app

# Install dependencies
COPY package*.json ./
RUN npm install


# Expose port 3000
EXPOSE 3000

# Command to run the app
CMD ["node", "index.js"]
