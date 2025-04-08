FROM node:18 AS builder

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .
RUN npm run build

FROM node:18-slim

WORKDIR /app

COPY --from=builder /app/package*.json ./
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/.next ./.next  
COPY --from=builder /app/next.config.mjs ./  

ENV PORT=3000
EXPOSE 3000

CMD ["npm", "start"]