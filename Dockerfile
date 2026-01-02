# ---------- Build ----------
    FROM node:20-alpine AS builder

    WORKDIR /app
    
    COPY package*.json ./
    RUN npm install --force
    
    COPY . .
    RUN npm run build
    
    
    # ---------- Runtime ----------
    FROM node:20-alpine
    
    WORKDIR /app
    
    # lightweight static server
    RUN npm install -g serve
    
    COPY --from=builder /app/dist ./dist
    
    EXPOSE 3000
    
    CMD ["serve", "-s", "dist", "-l", "3000"]