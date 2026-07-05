FROM node:22-alpine AS base

WORKDIR /app

# Copy workspace config
COPY package.json tsconfig.base.json ./
COPY shared/package.json shared/tsconfig.json ./shared/
COPY backend/package.json backend/tsconfig.json ./backend/

# Install dependencies
RUN npm ci --ignore-scripts

# Copy source
COPY shared/src ./shared/src
COPY backend/src ./backend/src
COPY backend/drizzle.config.ts ./backend/

# Expose port
EXPOSE 3000

CMD ["npm", "run", "dev", "-w", "backend"]
