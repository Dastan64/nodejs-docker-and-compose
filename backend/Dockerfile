FROM node:20-alpine AS builder

WORKDIR /app

COPY package*.json ./

RUN npm ci

COPY . .

RUN npm run build

FROM node:20-alpine AS production

WORKDIR /app

COPY --from=builder /app/package*.json ./

COPY --from=builder /app/ecosystem.config.js ./

RUN npm install -g pm2 && npm ci --omit=dev

COPY --from=builder /app/dist ./dist/

EXPOSE 3000

CMD ["pm2-runtime", "start", "ecosystem.config.js"]
