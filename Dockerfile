# syntax = docker/dockerfile:1

FROM node:22-slim AS base
LABEL fly_launch_runtime="Node.js"
WORKDIR /app

FROM base AS build
ENV NODE_ENV="production"
RUN apt-get update -qq && \
	apt-get install -y --no-install-recommends \
	build-essential=12.9 pkg-config=1.8.1-1 python-is-python3=3.11.2-1+deb12u1
COPY package-lock.json package.json ./
RUN npm ci --include=dev
COPY . .
RUN npm run build

FROM base
ENV NODE_ENV="production"
COPY --from=build /app /app
RUN mkdir -p /app/db
VOLUME /app/db
EXPOSE 3000
ENV host="0.0.0.0"
CMD [ "npm", "run", "start" ]
