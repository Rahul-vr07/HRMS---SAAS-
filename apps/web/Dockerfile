FROM node:20-alpine AS builder
WORKDIR /app
COPY package*.json ./
COPY apps/web/package*.json ./apps/web/
RUN npm install --workspace=@nexus-hr/web
COPY apps/web ./apps/web
WORKDIR /app/apps/web
RUN npm run build

FROM node:20-alpine
WORKDIR /app
COPY --from=builder /app/apps/web/.next/standalone ./
COPY --from=builder /app/apps/web/.next/static ./.next/static
COPY --from=builder /app/apps/web/public ./public
EXPOSE 3000
CMD ["node", "server.js"]
