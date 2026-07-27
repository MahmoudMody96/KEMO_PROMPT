# ============================================================
# Kemo Engine — single image: built frontend + API server
#
# Stage 1 builds the Vite app, stage 2 runs Express and serves the result.
# The build toolchain never reaches the final image.
# ============================================================

# --- Stage 1: build the frontend -----------------------------
FROM node:22-alpine AS frontend

WORKDIR /build

# Vite inlines VITE_* at build time, so anything the browser needs must be
# present now — not at container start.
ARG VITE_API_URL=""
ENV VITE_API_URL=$VITE_API_URL

COPY package.json package-lock.json* ./
RUN npm ci

COPY . .
RUN npm run build


# --- Stage 2: runtime ----------------------------------------
FROM node:22-alpine AS runtime

WORKDIR /app
ENV NODE_ENV=production

# dumb-init reaps zombies and forwards SIGTERM, so Coolify redeploys shut the
# server down cleanly instead of killing it mid-request.
RUN apk add --no-cache dumb-init

COPY server/package.json server/package-lock.json* ./server/
RUN cd server && npm ci --omit=dev && npm cache clean --force

COPY server/src   ./server/src
COPY server/migrations ./server/migrations
COPY --from=frontend /build/dist ./dist

# Never run the app as root.
RUN addgroup -g 1001 -S kemo && adduser -u 1001 -S kemo -G kemo \
    && chown -R kemo:kemo /app
USER kemo

EXPOSE 3000

# Any HTTP answer means the process is alive and serving. Readiness detail
# (database, migrations) is in the body of /api/health — a container that is up
# but degraded is far easier to diagnose than one Docker has killed.
HEALTHCHECK --interval=30s --timeout=5s --start-period=20s --retries=3 \
    CMD node -e "fetch('http://127.0.0.1:3000/api/health').then(()=>process.exit(0)).catch(()=>process.exit(1))"

ENTRYPOINT ["dumb-init", "--"]
CMD ["node", "server/src/index.js"]
