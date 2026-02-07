# =============================================================
# Self-contained Frontend Image  (Vite build → Nginx)
# Deployable on Railway / Render as a single service
# =============================================================

# ---- build stage ----
FROM node:18-alpine AS builder
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci --silent
COPY . .
# VITE_API_BASE_URL can be overridden at build time:
#   docker build --build-arg VITE_API_BASE_URL=https://api.myapp.com ...
ARG VITE_API_BASE_URL=""
ENV VITE_API_BASE_URL=$VITE_API_BASE_URL
RUN npm run build

# ---- production stage ----
FROM nginx:alpine

# Remove default nginx site
RUN rm /etc/nginx/conf.d/default.conf

# Copy nginx template (uses $PORT via envsubst)
COPY nginx/default.conf.template /etc/nginx/templates/default.conf.template

# Copy built SPA
COPY --from=builder /app/dist /usr/share/nginx/html

ENV PORT=3000
EXPOSE 3000

CMD ["nginx", "-g", "daemon off;"]
