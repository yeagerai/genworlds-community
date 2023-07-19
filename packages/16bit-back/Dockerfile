# Use an official Node runtime as a parent image
FROM node:18-alpine

# Set the working directory in the container to /app
WORKDIR /home/node/app

# Copy package.json and package-lock.json
COPY packages/16bit-back/package.json packages/16bit-back/package-lock.json ./

# Install any needed packages specified in package.json
RUN npm install

# Copy the current directory contents into the container at /app
COPY packages/16bit-back/ .

# Make port 5000 available to the world outside this container
EXPOSE 5000

# Run server.ts when the container launches with ts-node-dev and debugging enabled
CMD ["./node_modules/.bin/ts-node-dev", "--inspect=0.0.0.0", "--respawn", "--transpile-only", "src/server.ts"]
