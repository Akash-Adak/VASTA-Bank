# -----------------------------
# Stage 1: Build Stage
# -----------------------------
FROM node:20-alpine AS builder

WORKDIR /app

# Copy package files first (better caching)
COPY package.json package-lock.json ./

# Install dependencies
RUN npm install

# Copy all project files
COPY . .

# Build the Vite project
RUN npm run build


# -----------------------------
# Stage 2: Production Stage
# -----------------------------
FROM nginx:stable-alpine

# Remove default nginx config
RUN rm -rf /usr/share/nginx/html/*

# Copy build files from builder stage
COPY --from=builder /app/dist /usr/share/nginx/html

# Expose port
EXPOSE 80

# Start nginx
CMD ["nginx", "-g", "daemon off;"]