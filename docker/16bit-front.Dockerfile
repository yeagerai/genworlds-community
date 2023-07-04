# ==============================================================================
# ==== Step 1: build ===========================================================
# ==============================================================================

FROM node:18-alpine as builder

# Install packages to compile from source
RUN apk add --no-cache python3 make g++

# Create monorepo directory
WORKDIR /monorepo

# Install dependencies
COPY packages/16bit-front/package.json packages/16bit-front/yarn.lock ./
RUN yarn install --frozen-lockfile

# Copy lerna config file
COPY packages/16bit-front/lerna.json packages/16bit-front/nx.json ./

# Copy packages
COPY packages/16bit-front/packages ./packages

# Copy Services
COPY packages/16bit-front/projects ./projects

# Create a release of each lerna package
RUN yarn bootstrap

# Read and define environment variables
ARG node_environment=production
# ARG react_app_environment=production

ENV NODE_ENV=$node_environment
# ENV REACT_APP_ENV=$react_app_environment
ENV CI=true

# Create a release of each lerna package
RUN yarn build

# delete projects from node_modules
RUN yarn rimraf ./node_modules/@yeager/tank-viewer-web

# replace packages replace symbolic links by real files
RUN yarn symlink-resolver build ./node_modules/@yeager

# keep package.json, index.js and dist folder from @yeager packages
RUN find ./node_modules/@yeager -mindepth 2 -maxdepth 2 -type f -and -not -name package.json -and -not -name index.js -delete
RUN find ./node_modules/@yeager -mindepth 2 -maxdepth 2 -type d -and -not -name dist -and -not -name types -exec rm -rf {} \;

# ==============================================================================
# ==== Step 2: deliver =========================================================
# ==============================================================================

FROM node:18-alpine

WORKDIR /monorepo

# Copy projects
COPY --from=builder ./monorepo/projects ./projects
