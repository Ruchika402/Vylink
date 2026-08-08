FROM node:18-alpine

# Set work directory
WORKDIR /app

# Copy package files
COPY package.json pnpm-lock.yaml* ./
RUN npm install -g pnpm && pnpm install

# Copy project
COPY . .

# Expose port
EXPOSE 3000

# Start React app
CMD ["pnpm", "start"]