# Use the official image as a parent image
FROM node:18-alpine

# Set the working directory
WORKDIR /app

# Copy package.json and yarn.lock
COPY ./genworlds-community/.env /app/.env
COPY ./genworlds-community/packages/nano-vue/package.json ./ 
COPY ./genworlds-community/packages/nano-vue/yarn.lock ./

# Install dependencies using yarn
RUN yarn install

# Copy the current directory contents into the container at /app
COPY ./genworlds-community/packages/nano-vue/ .

# Expose port 8080 (or whatever port your dev server uses)
EXPOSE 8080

# Start Vue development server with hot-reloading
CMD ["yarn", "serve"]