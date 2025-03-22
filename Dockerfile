# Use Node.js 18 as the base image
FROM node:18-alpine

# Set working directory
WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies with minimal memory usage
RUN apk add --no-cache python3 make g++ && \
    npm install --only=production --legacy-peer-deps && \
    npm install -D typescript @types/node @types/express @types/cors @types/bcryptjs @types/jsonwebtoken && \
    npm cache clean --force

# Copy source code
COPY . .

# Build the application
RUN npm run build:server && \
    npm run build:client && \
    npm prune --production

# Set environment variables
ENV NODE_ENV=production
ENV PORT=5000

# Expose port
EXPOSE 5000

# Start the application
CMD ["npm", "start"] 