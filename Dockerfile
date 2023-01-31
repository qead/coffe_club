FROM node:10.19.0 as dependencies
WORKDIR /app
COPY package.json ./
RUN npm install

FROM node:10.19.0 as builder
WORKDIR /app
COPY . .
COPY --from=dependencies /app/node_modules ./node_modules
RUN npm run build

FROM node:10.19.0 as runner
WORKDIR /app
ENV NODE_ENV production
# If you are using a custom next.config.js file, uncomment this line.
COPY --from=builder /app/next.config.js ./
COPY --from=builder /app/src/public ./public
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./package.json
COPY --from=builder /app/nodemon.json ./
COPY --from=builder /app/server ./server
COPY --from=builder /app/tsconfig* ./
COPY --from=builder /app/config.json ./
COPY --from=builder /app/.env ./