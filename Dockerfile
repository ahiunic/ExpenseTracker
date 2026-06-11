FROM node:22-alpine AS client-builder
WORKDIR /build/client
COPY client/package*.json ./
RUN npm ci
COPY client/ ./
RUN npm run build

FROM node:22-alpine
ENV NODE_ENV=production
WORKDIR /app
COPY server/package*.json ./
RUN npm ci --omit=dev
COPY server/src ./src
COPY server/uploads ./uploads
COPY --from=client-builder /build/client/dist ./public
RUN mkdir -p uploads/gst-bills uploads/site-expenses && chown -R node:node /app
USER node
EXPOSE 5000
CMD ["node", "src/index.js"]

