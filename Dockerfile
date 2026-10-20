# Stage 1: build the Angular app
FROM node:20-alpine AS ui
WORKDIR /ui
COPY frontend/package*.json ./
RUN npm ci
COPY frontend/ ./
RUN npm run build && mkdir -p /ui/out && \
    if [ -d dist/frontend-ng/browser ]; then \
      cp -r dist/frontend-ng/browser/. /ui/out/; \
    else \
      cp -r dist/frontend-ng/. /ui/out/; \
    fi

# Stage 2: build the jar with the UI bundled into static/
FROM maven:3.9-eclipse-temurin-17 AS build
WORKDIR /app
COPY pom.xml .
RUN mvn dependency:go-offline -B
COPY src ./src
COPY --from=ui /ui/out/ ./src/main/resources/static/
RUN mvn clean package -DskipTests

# Stage 3: run it
FROM eclipse-temurin:17-jre
WORKDIR /app
COPY --from=build /app/target/*.jar app.jar
EXPOSE 8080
ENTRYPOINT ["java","-XX:MaxRAMPercentage=70","-XX:+UseSerialGC","-Xss512k","-jar","app.jar"]