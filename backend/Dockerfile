FROM node:20 AS builder

WORKDIR /app


COPY . .

COPY package.json package-lock.json ./
RUN npm install

RUN npm run build

# ---------- Production stage ----------
FROM node:20-alpine AS production

WORKDIR /app

COPY package.json package-lock.json ./

# Skip lifecycle scripts like "prepare"
ENV NODE_ENV=production
ENV NPM_CONFIG_IGNORE_SCRIPTS=true

RUN npm install --omit=dev

COPY --from=builder /app/dist ./dist

# This would not be done in the real-world application.
# sensitive config variables will be stored in the secure place like SSM parameter store.
COPY .env.production .env.production

EXPOSE 3000

# @TODO - use PM2 to run the server in production.
CMD ["node", "dist/index.js"]