# STAGE 1: Pruning
FROM oven/bun:1.3 AS pruner
WORKDIR /app
COPY . .

RUN bunx turbo prune --scope=api --docker

# STAGE 2: Builder
FROM oven/bun:1.3 AS builder
WORKDIR /app

COPY --from=pruner /app/out/json/ .
COPY --from=pruner /app/bun.lock ./bun.lock
RUN bun install

COPY --from=pruner /app/out/full/ .
WORKDIR /app/apps/api

ENV NODE_ENV=production

RUN bun build ./src/index.ts \
    --compile \
    --minify \
    --outfile server

RUN mkdir -p logs && chown -R 65532:65532 logs

# STAGE 3: Runner (Producción)
FROM gcr.io/distroless/base-debian12:nonroot
WORKDIR /app

COPY --from=builder /app/apps/api/server ./server
COPY --from=builder --chown=65532:65532 /app/apps/api/logs ./logs
COPY --from=builder /app/apps/api/src ./src

ENV NODE_ENV=production
ENV PORT=3001
USER nonroot

EXPOSE 3001

# Ejecutamos el binario
ENTRYPOINT ["./server"]