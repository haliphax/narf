# syntax = docker/dockerfile:1
ARG NODE_VERSION=18.17.1
FROM node:${NODE_VERSION}-slim as base
LABEL fly_launch_runtime="Node.js"
WORKDIR /app
ENV NODE_ENV="production"

FROM base as build
RUN apt-get update -qq && \
    apt-get install -y build-essential pkg-config python-is-python3
COPY --link package-lock.json package.json ./
RUN npm ci --include=dev
COPY --link . .
RUN npm run build
RUN npm prune --omit=dev

FROM base
COPY --from=build /app /app
RUN mkdir -p /app/db
VOLUME /app/db
EXPOSE 3000
ENV host="0.0.0.0"
CMD [ "npm", "run", "start" ]
