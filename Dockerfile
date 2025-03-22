# Build stage
FROM node:18-alpine AS builder

# Set working directory
WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy source code
COPY . .

# Create production build
RUN npm run build:client
RUN npm run build:server

# Production stage
FROM node:18-alpine

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install production dependencies only
RUN npm ci --only=production

# Copy built files
COPY --from=builder /app/build ./build
COPY --from=builder /app/dist ./dist
COPY .env ./

# Expose port
EXPOSE 5000

# Start the application
CMD ["npm", "start"] 