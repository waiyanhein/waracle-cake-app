# ---------- Build stage ----------
    FROM node:20 AS builder

    WORKDIR /app
    
    COPY package.json package-lock.json ./
    COPY tsconfig*.json ./
    COPY vite.config.ts .
    COPY index.html .  
    # @IMPORTANT - in the real-world, if we are deploying as part of the CI/CD pipeline, .env file should be dynamically created as part of the pipeline.
    COPY .env.production .env.production
    COPY src/ ./src/
    COPY public/ ./public/

    RUN npm install
    RUN npm run build  # runs "vite build"

    # ---------- Serve stage ----------
    FROM node:20-alpine AS production
    
    WORKDIR /app
    
    # Install a static file server
    RUN npm install -g serve
    
    # Copy only the built static files from the builder
    COPY --from=builder /app/dist ./dist

    # Copy entrypoint script
    # COPY entrypoint.sh /app/entrypoint.sh
    # RUN chmod +x /app/entrypoint.sh
    
    EXPOSE 3001
    # ENTRYPOINT ["/app/entrypoint.sh"]
    
    CMD ["serve", "-s", "dist", "-l", "3001"]