FROM node:22-alpine AS builder

WORKDIR /app

RUN npm install -g pnpm@10

COPY pnpm-workspace.yaml pnpm-lock.yaml package.json ./
COPY tsconfig.base.json tsconfig.json ./

COPY artifacts/sentek/package.json ./artifacts/sentek/
COPY lib/api-client-react/package.json ./lib/api-client-react/
COPY lib/api-spec/package.json ./lib/api-spec/
COPY lib/api-zod/package.json ./lib/api-zod/
COPY lib/db/package.json ./lib/db/
COPY scripts/package.json ./scripts/

RUN pnpm install --frozen-lockfile

COPY artifacts/sentek/ ./artifacts/sentek/
COPY lib/ ./lib/
COPY scripts/ ./scripts/
COPY attached_assets/ ./attached_assets/

ENV BASE_PATH=/
ENV NODE_ENV=production

RUN pnpm --filter @workspace/sentek run build

FROM nginx:1.27-alpine

COPY --from=builder /app/artifacts/sentek/dist/public /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
