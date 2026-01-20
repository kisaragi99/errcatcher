# Development Stage
FROM node:20-alpine AS dev
WORKDIR /app
COPY package*.json ./
RUN apk add --no-cache python3 make g++ && npm install
COPY . .
CMD ["sh", "-c", "npm run dev -- --host ${VITE_DEV_SERVER_HOST}"]

# Build Stage
FROM node:20-alpine AS builder
ARG VITE_API_URL
ENV VITE_API_URL=${VITE_API_URL}
WORKDIR /app
COPY package*.json ./
RUN apk add --no-cache python3 make g++ && npm ci
COPY . .
RUN npm run build

# Production Stage
FROM node:20-alpine AS production
WORKDIR /app
RUN npm install -g http-server
COPY --from=builder /app/dist ./dist
EXPOSE ${CLIENT_PORT}
CMD ["sh", "-c", "http-server dist -p ${CLIENT_PORT} --proxy http://localhost:${CLIENT_PORT}?"]
