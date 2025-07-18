# Stages "FROM" are like having a different dockerfile("image") for different environments 
# used to build and run different containers via the compose.yml file

# Base build
FROM node:alpine AS base

# Set working directory
WORKDIR /app

# Set environment variables
ENV NODE_ENV=development

# Copy package files to container 
COPY package*.json ./

# Install dependencies 
RUN npm ci

# Copy source code
COPY . .

# Expose port
EXPOSE 4000

# Start the application in development mode
CMD ["npm", "run", "dev"]

# Development build
FROM base AS development
CMD ["npm", "run", "dev"]

# Production build
FROM base AS production

ENV NODE_ENV=production

# Start the application in production mode
CMD ["npm", "start"]
