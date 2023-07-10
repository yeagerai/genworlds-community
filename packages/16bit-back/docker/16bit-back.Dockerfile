#-------------------------------------------------------------------------------
# STAGE 1: Build dependencies and compile src
#-------------------------------------------------------------------------------

FROM node:18-alpine as dep_builder

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
COPY packages/16bit-back/tsconfig.json /root/build/dep-tsc/tsconfig.json
COPY packages/16bit-back/tsconfig.build.json /root/build/dep-tsc/tsconfig.build.json
COPY packages/16bit-back/shared /root/build/dep-tsc/shared
COPY packages/16bit-back/src /root/build/dep-tsc/src

# Compile ts code
WORKDIR /root/build/dep-tsc
RUN ./node_modules/.bin/tsc -p ./tsconfig.build.json

# Fix chown issues
# RUN set -ex; \
#     chown -R root:root /root/build/dep-modules/node_modules; \
#     chown -R root:root /root/build/dep-tsc/dist

#-------------------------------------------------------------------------------
# STAGE 2: Setup server
#-------------------------------------------------------------------------------

FROM node:18-alpine

# Expose a communication port
EXPOSE 5000

# Setup user
USER node

# Create app directory
RUN mkdir -p /home/node/app
WORKDIR /home/node/app

# Copy node_modules
COPY packages/16bit-back/package.json packages/16bit-back/package-lock.json ./
COPY --from=dep_builder --chown=root:root /root/build/dep-tsc/dist ./
COPY --from=dep_builder --chown=root:root /root/build/dep-modules/node_modules ./node_modules

# Run nodemon process
CMD [ "node", "./src/server.js" ]
