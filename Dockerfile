# ============================================================
# Kemo Engine — single image: built frontend + API server
#
# Stage 1 builds the Vite app, stage 2 runs Express and serves the result.
# The build toolchain never reaches the final image.
# ============================================================

# --- Stage 1: build the frontend -----------------------------
FROM node:22-alpine AS frontend

WORKDIR /build

# vite, tailwind and the eslint toolchain are devDependencies. Under
# NODE_ENV=production npm skips those, `vite` never lands in node_modules, and
# the build dies with "sh: vite: not found". Coolify injects NODE_ENV as a
# build arg, so pin development here and ask for dev dependencies explicitly —
# the build stage is thrown away, and none of it reaches the final image.
ENV NODE_ENV=development

COPY package.json package-lock.json* ./
RUN npm ci --include=dev

COPY . .
RUN npm run build


# --- Stage 2: runtime ----------------------------------------
FROM node:22-alpine AS runtime

WORKDIR /app
ENV NODE_ENV=production

# No init wrapper: the app spawns no child processes, so there are no zombies
# to reap, and index.js installs its own SIGTERM handler for clean shutdown.
# Skipping it also drops the only build step that needs the Alpine package CDN.

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

CMD ["node", "server/src/index.js"]
