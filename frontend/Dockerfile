# Use official Node image
FROM node:18-alpine

# Install pnpm
RUN npm install -g pnpm

# Set work directory
WORKDIR /app

# Copy package files
COPY package.json pnpm-lock.yaml* ./

# Install dependencies
RUN pnpm install --frozen-lockfile

# Copy project
COPY . .

# Expose port
EXPOSE 3000

# Start React app
CMD ["pnpm", "start"]