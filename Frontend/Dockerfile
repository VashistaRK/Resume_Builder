# Stage 1: Build
FROM node:20-slim
WORKDIR /app
COPY package*.json ./
RUN npm ci --legacy-peer-deps
COPY . .
RUN npm run build

# Install a simple static server
RUN npm install -g serve

# Expose frontend port
EXPOSE 3000

# Start frontend (adjust if backend also runs here)
CMD ["serve", "-s", "dist", "-l", "3000"]
