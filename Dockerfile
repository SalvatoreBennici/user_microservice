FROM gradle:8.14.0-jdk17-alpine AS build

WORKDIR /app

RUN apk add --no-cache nodejs npm

COPY build.gradle.kts settings.gradle.kts gradle.properties ./
COPY gradle/ gradle/

COPY package*.json ./

COPY . .

RUN gradle npmBuild --no-daemon