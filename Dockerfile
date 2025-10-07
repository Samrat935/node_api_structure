# Use official Node.js LTS image for better stability and security
FROM node:20.12.2

# Set working directory inside the container
WORKDIR /imi-api-backend

# Copy only package.json and package-lock.json for dependency installation
COPY package*.json ./

# Copy environment file (production)
COPY .env.production ./

# Remove existing lock file and node_modules to ensure a clean install
RUN rm -rf package-lock.json node_modules

# Install dependencies (use --legacy-peer-deps for compatibility)
RUN npm install --legacy-peer-deps

# Install development dependencies (type definitions)
RUN npm install --save-dev @types/amqplib@0.10.4

# Copy TypeScript config and verify its presence
COPY tsconfig.json ./
RUN test -f tsconfig.json && cat tsconfig.json

# Copy the rest of the application source code
COPY . .

# Print TypeScript and amqplib types versions for debugging
RUN npm list typescript && npm list @types/amqplib

# Build the TypeScript project
RUN npm run build

# Expose the application port
EXPOSE 8090

# Use a non-root user for better security (optional, if your app supports it)
# RUN useradd --user-group --create-home --shell /bin/false appuser
# USER appuser

# Start the application in production mode
CMD ["npm", "run", "start:prod"]
