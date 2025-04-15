# syntax = docker/dockerfile:1

ARG NODE_VERSION=22

FROM node:${NODE_VERSION}-slim AS base
LABEL fly_launch_runtime="Node.js"
WORKDIR /app
RUN apt-get update -qq && \
	apt-get install -y --no-install-recommends \
	build-essential=12.9 pkg-config=1.8.1-1 python-is-python3=3.11.2-1+deb12u1

FROM base AS npm
COPY package-lock.json package.json ./
RUN npm ci --include=dev

FROM npm AS build
ENV NODE_ENV="production"
COPY . .
RUN npm run build

FROM npm
ENV NODE_ENV="production"
COPY --from=build /app/tsconfig.json /app/tsconfig.json
COPY --from=build /app/dist /app/dist
COPY --from=build /app/src /app/src
RUN mkdir -p /app/db
VOLUME /app/db
EXPOSE 3000
ENV host="0.0.0.0"
CMD [ "npm", "run", "start" ]
