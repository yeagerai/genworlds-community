#-------------------------------------------------------------------------------
# STAGE 1: Build dependencies and compile src
#-------------------------------------------------------------------------------

FROM node:18-alpine as node-builder-16bit-back

# Allow packages to compile from source
#RUN apk add --no-cache python3 make g++ git

# Create build directories
RUN mkdir -p /root/build/dep-modules \
        /root/build/dep-tsc

# Copy package.json
COPY packages/16bit-back/package.json packages/16bit-back/package-lock.json /root/build/dep-modules/

# Install dependencies and compile ts code
RUN set -ex; \
    cp /root/build/dep-modules/package.json /root/build/dep-tsc/package.json; \
    cp /root/build/dep-modules/package-lock.json /root/build/dep-tsc/package-lock.json; \
    \
    cd /root/build/dep-modules; \
    NODE_ENV=production npm ci; \
    \
    cd /root/build/dep-tsc; \
    npm ci

# Copy src
COPY packages/16bit-back/tsconfig.json packages/16bit-back/tsconfig.build.json /root/build/dep-tsc/
COPY packages/16bit-back/shared /root/build/dep-tsc/shared
COPY packages/16bit-back/src /root/build/dep-tsc/src

# Compile ts code
RUN set -ex; \
    cd /root/build/dep-tsc; \
    ./node_modules/.bin/tsc -p ./tsconfig.build.json

# Fix chown issues
RUN set -ex; \
    chown -R root:root /root/build/dep-modules/node_modules; \
    chown -R root:root /root/build/dep-tsc/dist

# ---- Stage 2: Build 16bit-front using Node ----
FROM node:18-alpine AS node-builder-16bit-front
WORKDIR /app
COPY packages/16bit-front/ ./
RUN npm install yarn
RUN yarn install
RUN yarn build

# ---- Stage 3: Build nano-vue using Node ----
FROM node:18-alpine AS node-builder-nano-vue
WORKDIR /app
COPY packages/nano-vue/package*.json ./
RUN npm install
COPY packages/nano-vue/ ./
RUN npm run build

# ---- Stage 4: Copy artifacts to the final Python image ----
FROM python:3.10.8 AS python-stage
WORKDIR /app

# Install Redis
RUN apt-get update && \
    apt-get install -y curl && \
    curl -sL https://deb.nodesource.com/setup_18.x | bash - && \
    apt-get install -y redis-server nodejs

RUN npm install express http-proxy
# Copy build artifacts from each stage
COPY packages/16bit-back/package.json packages/16bit-back/package-lock.json ./
COPY --from=node-builder-16bit-back --chown=root:root /root/build/dep-tsc/dist ./
COPY --from=node-builder-16bit-back --chown=root:root /root/build/dep-modules/node_modules ./node_modules

COPY --from=node-builder-16bit-front /app/projects/tank-viewer-web/dist ./16bit-front
COPY packages/16bit-front/server.js ./16bit-front/server.js

COPY --from=node-builder-nano-vue /app/dist ./nano-vue
COPY packages/nano-vue/server.js ./nano-vue/server.js

COPY packages/gateway/server.js ./gateway/server.js

# ---- Stage 5: Copy all Python scripts and pip install all dependencies ----
COPY packages/world-instance/requirements.txt ./
RUN pip install --no-cache-dir -r requirements.txt

COPY packages/world-instance ./world-instance
COPY packages/real-ws ./real-ws
COPY packages/mocked-ws ./mocked-ws

COPY use_cases ./use_cases

COPY .env ./.env

COPY deployments/shared-scripts/runner.py ./runner.py

EXPOSE 80
EXPOSE 9000

# ---- Stage 6: Execute the runner ----
CMD ["python", "runner.py"]