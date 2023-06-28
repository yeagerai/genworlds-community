# Use the official image as a parent image
FROM node:lts-alpine as build-stage

# Set the working directory
WORKDIR /app

# Copy package.json and package-lock.json
COPY packages/nano-vue/package*.json ./

# Install dependencies
RUN npm install

# Copy the current directory contents into the container at /app
COPY packages/nano-vue/ .

# Build the app
RUN npm run build

# Production stage
FROM nginx:stable-alpine as production-stage

COPY --from=build-stage /app/dist /usr/share/nginx/html

# Expose port 80
EXPOSE 80

# Start Nginx server
CMD ["nginx", "-g", "daemon off;"]