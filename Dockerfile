# Stage 1: Build
FROM node:20-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

# Stage 2: Runtime
FROM node:20-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install --omit=dev
COPY --from=builder /app/dist ./dist
COPY index.js ./

# Create the logs directory and hand ownership to the non-root 'node' user
# (the node:alpine image already includes this user/group out of the box)
RUN mkdir -p /app/logs && chown -R node:node /app

# Drop root privileges
USER node

EXPOSE 5000
CMD ["node", "index.js"]