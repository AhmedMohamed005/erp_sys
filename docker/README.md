# Docker guide for this repo ✅

This guide shows a minimal production-ready Docker setup for your Laravel backend and React (Vite) frontend with a Postgres database.

Files added:
- `backend/Erp_project/Dockerfile` — PHP-FPM production image
- `backend/Erp_project/docker/entrypoint.sh` — entrypoint for optional migrations & DB wait
- `backend/nginx/default.conf` — nginx config to serve Laravel + proxy to PHP-FPM
- `frontend/my-react-app/Dockerfile` — multi-stage build (node -> nginx)
- `frontend/my-react-app/nginx/default.conf` — nginx to serve SPA + proxy /api/ to backend
- `docker-compose.yml` — local stacks for DB, backend, web (nginx), frontend

Quick start (replace `<dockerhub-username>` in `docker-compose.yml` first):

1. Set up your backend `.env` (important):
   - `DB_CONNECTION=pgsql`
   - `DB_HOST=db`
   - `DB_PORT=5432`
   - `DB_DATABASE=erp`
   - `DB_USERNAME=erp`
   - `DB_PASSWORD=secret`
   - `APP_URL=http://localhost:8080`

2. Build & run locally:
   docker-compose build
   docker-compose up -d

   - Backend (PHP-FPM) will be reachable through `web` nginx on http://localhost:8080
   - Frontend will be at http://localhost:3000
   - Postgres on host `localhost:5432`

3. Push images to Docker Hub (optional):
   docker login
   docker build -t <dockerhub-username>/erp-backend:latest ./backend/Erp_project
   docker build -t <dockerhub-username>/erp-frontend:latest ./frontend/my-react-app
   docker push <dockerhub-username>/erp-backend:latest
   docker push <dockerhub-username>/erp-frontend:latest

Notes & next steps:
- CI/CD: add Docker build + push steps to your pipeline (GitHub Actions / GitLab CI).
- For production replace `docker-compose` with your orchestrator (Kubernetes, ECS, Azure App Service, etc.).
- You may want to run `php artisan config:cache`, `route:cache` etc as part of your build process.
- If you prefer an all-in-one single container for the backend (nginx + php-fpm), I can provide an alternative Dockerfile.

If you want, I can:
1) replace `<dockerhub-username>` with your Docker Hub username and commit the files, and/or
2) add GitHub Actions to build and push images on push to `main`, and/or
3) generate Kubernetes manifests / Helm chart for deployment.

Tell me which of the three you'd like next. 🔧
