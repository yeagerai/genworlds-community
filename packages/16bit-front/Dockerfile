# Use an official Node runtime as a parent image
FROM node:18-alpine

# Set the working directory in the container to /app
WORKDIR /app

# Copy package.json and yarn.lock
COPY ./genworlds-community/packages/16bit-front/package.json ./
COPY ./genworlds-community/packages/16bit-front/yarn.lock ./

# Install any needed packages specified in package.json
RUN yarn install

# Copy the current directory contents into the container at /app
COPY ./genworlds-community/packages/16bit-front/ /app

# Make port 8080 available to the world outside this container
EXPOSE 8080

# Run serve when the container launches
CMD ["yarn", "serve"]
