# Stage 1: Build with Gradle
FROM gradle:8.12.1-jdk-alpine AS build
WORKDIR /usr/src/app

RUN apk add --no-cache nodejs npm

# Copy gradle configuration files first (for better layer caching)
COPY build.gradle.kts settings.gradle.kts ./app/
COPY gradle ./app/gradle
COPY ./gradlew ./gradlew.bat ./app/

# Copy the rest of the source code
COPY . .

# Build the application
RUN gradle build
RUN gradle installProdDependencies

# Stage 2: Runtime image with Node.js
FROM node:24-alpine AS runtime
WORKDIR /app
RUN apk add --update --no-cache curl

# Copy necessary files from the build stage
COPY --from=build /usr/src/app/node_modules ./node_modules
COPY --from=build /usr/src/app/dist ./dist
COPY --from=build /usr/src/app/src/interfaces/restful/openapi.yaml ./src/interfaces/restful/openapi.yaml
COPY --from=build /usr/src/app/package.json ./

# Expose port
EXPOSE 3000

# Start the application
CMD ["npm", "run", "start"]