# Build stage
FROM node:18-alpine AS builder

# Set working directory
WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies with increased memory limit and clean npm cache
RUN npm cache clean --force && \
    NODE_OPTIONS="--max_old_space_size=2048" npm install --no-audit --no-fund

# Copy source code
COPY . .

# Set environment variable for React build
ENV NODE_ENV=production
ENV CI=true

# Create production builds with increased memory limit
RUN NODE_OPTIONS="--max_old_space_size=2048" npm run build:server && \
    NODE_OPTIONS="--max_old_space_size=2048" npm run build:client

# Production stage
FROM node:18-alpine

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install production dependencies with increased memory limit
RUN npm cache clean --force && \
    NODE_OPTIONS="--max_old_space_size=2048" npm install --production --no-audit --no-fund

# Copy built files
COPY --from=builder /app/build ./build
COPY --from=builder /app/dist ./dist

# Set environment variables
ENV NODE_ENV=production
ENV PORT=5000

# Expose port
EXPOSE 5000

# Start the application
CMD ["npm", "start"] 