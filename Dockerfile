# syntax=docker/dockerfile:1

# Comments are provided throughout this file to help you get started.
# If you need more help, visit the Dockerfile reference guide at
# https://docs.docker.com/go/dockerfile-reference/

# Want to help us make this template better? Share your feedback here: https://forms.gle/ybq9Krt8jtBL3iCk7

ARG NODE_VERSION=20.9.0

################################################################################
# Use node image for base image for all stages.
FROM node:${NODE_VERSION}-alpine as base

# Set working directory for all build stages.
ENV DATA_FOLDER_PATH /data
WORKDIR /usr/src


# Copy the rest of the source files into the image.
COPY . .
# Run the build script.
# Copy package.json so that package manager commands can be used.
COPY package.json .
RUN npm install
ENV NODE_ENV production
RUN npm run build

# Use production node dockenvironment by default.

# Run the application as a non-root user.
USER node




# Expose the port that the application listens on.
EXPOSE 3000

# Run the application.
CMD npm run start
