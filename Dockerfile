# syntax = docker/dockerfile:1
FROM node:18-slim as base
LABEL fly_launch_runtime="Node.js"
WORKDIR /app
ENV NODE_ENV="production"

FROM base as build
RUN apt-get update -qq && \
	apt-get install -y --no-install-recommends \
	build-essential=12.9 pkg-config=1.8.1-1 python-is-python3=3.11.1-3
COPY --link package-lock.json package.json ./
RUN npm ci --include=dev
COPY --link . .
RUN npm run build

FROM base
COPY --from=build /app /app
RUN mkdir -p /app/db
VOLUME /app/db
EXPOSE 3000
ENV host="0.0.0.0"
CMD [ "npm", "run", "start" ]
