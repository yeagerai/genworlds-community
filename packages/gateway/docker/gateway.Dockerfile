# Use an official Node.js runtime as a parent image
FROM node:lts-alpine

# Set the working directory in the container to /app
WORKDIR /app

# Copy the current directory contents into the container at /app
COPY packages/gateway/ .

# If you have package.json or other dependency files, copy them and install dependencies
# COPY packages/gateway/package*.json ./
RUN npm install http-proxy

# Expose ports 9000 for the gateway service and 9229 for the Node.js debugger
EXPOSE 9000 9229

# Run server.js when the container launches, in debug mode
CMD ["node", "--inspect-brk=0.0.0.0", "src/server.js"]
