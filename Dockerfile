# syntax = docker/dockerfile:1

ARG NODE_VERSION=20

FROM node:${NODE_VERSION}-slim AS base
LABEL fly_launch_runtime="Node.js"
WORKDIR /app
ENV NODE_ENV="production"

FROM base AS build
RUN apt-get update -qq && \
	apt-get install -y --no-install-recommends \
	build-essential=12.9 pkg-config=1.8.1-1 python-is-python3=3.11.2-1+deb12u1
COPY package-lock.json package.json ./
RUN npm ci --include=dev
COPY . .
RUN npm run build && npm prune --omit=dev

FROM base
COPY --from=build /app /app
RUN mkdir -p /app/db
VOLUME /app/db
EXPOSE 3000
ENV host="0.0.0.0"
CMD [ "npm", "run", "start" ]
