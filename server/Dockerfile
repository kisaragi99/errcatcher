# Development stage
FROM node:20-slim AS development
WORKDIR /app
RUN apt-get update && apt-get install -y --no-install-recommends \
    curl \
    && rm -rf /var/lib/apt/lists/*
COPY package*.json ./
RUN npm install --include=dev
COPY . .
CMD ["npm", "run", "dev"]

# Production stage
FROM node:20-slim AS production
WORKDIR /app
COPY package*.json ./
RUN npm install --omit=dev
COPY --from=development /app .
EXPOSE ${BACKEND_PORT}
CMD ["npm", "start"]