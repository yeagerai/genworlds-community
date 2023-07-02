# Use the official image as a parent image
FROM node:lts-alpine as build-stage

# Set the working directory
WORKDIR /app

# Copy package.json and yarn.lock
COPY .env /app/.env
COPY packages/nano-vue/package.json packages/nano-vue/yarn.lock ./

# Install dependencies using yarn
RUN yarn install

# Copy the current directory contents into the container at /app
COPY packages/nano-vue/ .

# Build the app using yarn
RUN yarn build

# Production stage
FROM nginx:stable-alpine as production-stage

COPY --from=build-stage /app/dist /usr/share/nginx/html

# Expose port 80
EXPOSE 80

# Start Nginx server
CMD ["nginx", "-g", "daemon off;"]
