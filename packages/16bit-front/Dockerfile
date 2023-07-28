# Use an official Node runtime as a parent image
FROM node:18-alpine

# Set the working directory in the container to /app
WORKDIR /app

# Install Python, make and g++
RUN apk add --no-cache python3 make g++

# Copy package.json and yarn.lock
COPY ./genworlds-community/packages/16bit-front/package.json ./
COPY ./genworlds-community/packages/16bit-front/yarn.lock ./

# Install any needed packages specified in package.json
RUN yarn install

# Copy the current directory contents into the container at /app
COPY ./genworlds-community/packages/16bit-front/ /app

# Make port 8081 available to the world outside this container
EXPOSE 8081

# Run serve when the container launches
CMD ["yarn", "serve"]
