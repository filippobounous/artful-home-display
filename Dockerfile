# Base stage with dependencies
FROM node:20-alpine AS base
WORKDIR /app

# Install dependencies
COPY package.json package-lock.json ./
RUN npm ci

# Stage 1: Build the application
FROM base AS builder
COPY . .
ARG VITE_API_URL=http://localhost:8000
ENV VITE_API_URL=$VITE_API_URL
RUN npm run build

# Stage 2: Development server (optional)
# Use this stage when you need hot reloading inside Docker.
# The docker-compose file contains commented instructions to enable it.
FROM base AS dev
COPY . .
ARG VITE_API_URL=http://localhost:8000
ENV VITE_API_URL=$VITE_API_URL
EXPOSE 8080
CMD ["npm", "run", "dev", "--", "--host"]

# Stage 3: Serve the built app with nginx
FROM nginx:alpine
COPY --from=builder /app/dist /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
